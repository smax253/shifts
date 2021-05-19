//connect to firebase
const firebaseConnections = require("../config/firebaseConnections");
const db = firebaseConnections.initializeCloudFirebase();

const roomData = require("./rooms.js");

const fetch = require("node-fetch");
const { database } = require("firebase-admin");
const { generate } = require("password-hash");

const axios = require('axios');

module.exports = {
  async getAllStocks() {
      const snapshot = await db.collection('stocks').get();
      let arr = [];
      snapshot.forEach(doc => {
        arr.push(doc.data());
      });
      return arr;
  },
  async getStock(symbol) {
        const userRef = db.collection('stocks').doc(symbol);
        const doc = await userRef.get();
        if (!doc.exists) {
          console.log('No such stock!');
        } else {
          return doc.data();
        }
        return null;
  },

  async addStock(symbol) {
    try {
      //do alphavantage call here
      if (!symbol) throw "Stock symbol does not exist";
      
      const API_KEY = process.env.alphavantage_key;

    const API_Call =
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=` +
      symbol +
      `&apikey=` +
      API_KEY;
    
    let newStock = {
      symbol: symbol,
      name: "NA",
      prices: [],
      chart: {
        days: [],
        weeks: [],
      },
    };


      await fetch(API_Call)
        .then(function (response) {
          return response.json();
        })
        .then(async function (data) {
          //Parsing Data
          let counter = 0;
          for (var key in data["Time Series (Daily)"]) {
            let current = data["Time Series (Daily)"][key]["4. close"];
            current = parseFloat(current);

            if (counter <= 30) {
              newStock.chart.days.unshift({ date: key, value: current });
            }
         
            if (counter == 1) {
              newStock.prices.push({ date: "1d", value: current });
            }
            if (counter == 7) {
              newStock.prices.push({ date: "1w", value: current });
            }
            if (counter == 30) {
              newStock.prices.push({ date: "1m", value: current });
            }
            if (counter == 90) {
              newStock.prices.push({ date: "3m", value: current });
            }
            if (counter == 180) {
              newStock.prices.push({ date: "6m", value: current });
            }

          }
        });
      
      //name
      const API_Call3 =
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=` +
        symbol +
        `&apikey=` +
        API_KEY;

    await fetch(API_Call3)
      .then(function (response) {
        return response.json();
      })
      .then(async function (data) {
        //Parsing Data
        newStock.name = "Name" in data ? data["Name"] : symbol;
      });
    
    
    const API_Call2 =
      `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=` +
      symbol +
      `&apikey=` +
      API_KEY;

    await fetch(API_Call2)
      .then(function (response) {
        return response.json();
      })
      .then(async function (data) {
        //Parsing Data
        let counter = 0;
        for (var key in data["Weekly Adjusted Time Series"]) {
          let current = data["Weekly Adjusted Time Series"][key]["4. close"];
          current = parseFloat(current);
          newStock.chart.weeks.unshift({ date: key, value: current });
          if (counter == 26) {
            newStock.prices.push({ date: "6m", value: current });
          }
          if (counter == 52) {
            newStock.prices.push({ date: "1y", value: current });
          }
          if (counter == 260) {
            newStock.prices.push({ date: "5y", value: current });
            break;
          }

        }
      });
      
      
      
      if (newStock.prices === []) {
        console.log("Did not update " + symbol)
        return;
      }

      // Add a new document in collection "users" with ID 'username'
      const res = await db.collection('stocks').doc(symbol).set(newStock);
      this.updateStockData(symbol);
      return await this.getStock(symbol);
  
    } catch (e) {
      throw e;
    }
 },

  async generateStocks(tickers) {
    //web scrapper do this part
    let presets = ["COIN", "MSFT", "AAPL", "DASH", "SNAP", "TSLA", "NFLX", "GOOG", "FB", "DIS"];
    let all = await module.exports.getAllStocks();
    presets.forEach((item, index) => {
      if (all.includes(item)) {
        presets.splice(index, index)
      }
    })
    let arr = [...presets, ...tickers];
    console.log("Adding the following tickers to the firebase \'stocks\' collection:", arr);

    for (let i = 0; i < arr.length; i++) {
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await module.exports.addStock(arr[i]);
      await roomData.addRoom(arr[i]);
      await delay(60000);
    }
    console.log("Done!");
    return await module.exports.getAllStocks();
  },

  async wipeStocks(allStocks) {
    console.log("here in wipe stocks")
    if (!allStocks) {
      let all = await module.exports.getAllStocks();
      all.forEach((stock) => {
        allStocks.push(stock.symbol)
      })
    }
    console.log(allStocks)
    for (let stock of allStocks) {
      console.log(stock);
        db.collection('stocks').doc(stock).delete().then(() => {
          console.log('successfully deleted ' + stock)
          
            //await roomData.deleteRoom(stock.symbol);
        }).catch((error) => {
          console.log('error deleting ' + stock)
          console.log(error)
        }) 
    }

    for (let i = 0; i < allStocks.length; i++) {
      await roomData.deleteRoom(allStocks[i]);
    }

    return await module.exports.getAllStocks();
  },

  async topMovers() {
    try {
      let allStocks = await module.exports.getAllStocks();
      let topTenMovers = [];
      allStocks = allStocks.map((stock) => {
        const prevA = stock.daily.find((item) => item.date === 'pc').value;
        const currentA = stock.daily.find((item) => item.date === 'c').value;
        return {
          ...stock,
          change: Math.abs((currentA - prevA) / prevA)
        }
      })
      allStocks.sort((stockA, stockB) => {
        return stockA.change - stockB.change;
      })

      topTenMovers = allStocks.length > 10 ? allStocks.slice(allStocks.length - 10, allStocks.length) : allStocks;
      topTenMovers.reverse();
      let topRooms = [];

      for (let i = 0; i < topTenMovers.length; i++){
        let topMovingRoom = await roomData.getRoom(topTenMovers[i].symbol)
        topRooms.push(topMovingRoom);
      }
      return topRooms;

    } catch (e) {
      throw e;
    }
  },
  async updateStockData(stockSymbol) {
    const userRef = db.collection('stocks').doc(stockSymbol);
    const doc = await userRef.get();
    if (!doc.exists) {
      console.log('No such stock!');
    } else {
      const stock = doc.data()
      const { data } = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${process.env.finnhub_key}`);
      const daily = [];
      Object.keys(data).forEach((item) => {
        daily.push({
          date: item,
          value: data[item]
        });
      })
      stock.daily = daily;
      const res = await db.collection('stocks').doc(stockSymbol).set(stock);
      return await this.getStock(stockSymbol);
    }
    return null;
  },
  async getStocks(symbols) {
    const stockList = [];
    for (const symbol of symbols) {
      const stock = await this.getStock(symbol);
      stockList.push(stock);
    }
    return stockList;
  },
  async updateIndexes() {
    const indexes = {
      DOW: { name: "Dow Jones", symbol: "^DJI" },
      NASDAQ: { name: "Nasdaq", symbol: "^IXIC" },
      SP:{ name: "S&P 500", symbol: "^GSPC" }
    };
    
    for (const name of Object.keys(indexes)) {
      const index = indexes[name];
      const { data } = await axios.get(`https://query1.finance.yahoo.com/v7/finance/chart/${index.symbol}?interval=5m`);
      index.prices = [
        { date: 'c', value: data.chart.result[0].meta.regularMarketPrice },
        {date:'pc', value: data.chart.result[0].meta.previousClose}
      ]
    }
    return indexes;
   //await db.collection('stocks').doc(stockSymbol).set(stock);
  },
  async indexes() {
     const indexes = {
      DOW: { name: "Dow Jones", symbol: "^DJI" },
      NASDAQ: { name: "Nasdaq", symbol: "^IXIC" },
      SP:{ name: "S&P 500", symbol: "^GSPC" }
    };
    
    for (const name of Object.keys(indexes)) {
      const index = indexes[name];
      const { data } = await axios.get(`https://query1.finance.yahoo.com/v7/finance/chart/${index.symbol}?interval=5m`);
      index.prices = [
        { date: 'c', value: data.chart.result[0].meta.regularMarketPrice },
        {date:'pc', value: data.chart.result[0].meta.previousClose}
      ]
    }
    return indexes;
  },

  async updateMentions(tickerMentions) {
    console.log("tickerMentions here")
    console.log(tickerMentions)
    try {
      for (let { stock, timesCounted } of tickerMentions) {
        const res = await db.collection('stockMentions').doc(stock).set({ "symbol": stock, "timesCounted": timesCounted });
      }
    } catch (e) {
      throw e
   } 
  },

  async getTopMentions() {
    console.log("here get")
    try {
      console.log("made it here")
      const allStockMentions = await db.collection('stockMentions').get();
      let arr = [];
      allStockMentions.forEach((item) => {
        arr.push(item.data())
      })
      console.log(arr)
      let getRooms = await Promise.all(arr.map(async ({ symbol, timesCounted}) => {
        return await roomData.getRoom(symbol)
      }))
      getRooms = getRooms.length > 10 ? getRooms.slice(0, 10) : getRooms;
      return getRooms;
      

    } catch (e) {
      throw e
    }
  }

}