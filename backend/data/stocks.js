//connect to firebase
const firebaseConnections = require("../config/firebaseConnections");
const db = firebaseConnections.initializeCloudFirebase();

const roomData = require("./rooms.js");
const userData = require("./users.js")

const fetch = require("node-fetch");
const { database } = require("firebase-admin");
const { generate } = require("password-hash");

const axios = require('axios');
const redis = require('redis');
let client;
if (process.env.REDIS_URL) {
  client = redis.createClient(process.env.REDIS_URL);
}
else client = redis.createClient();
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


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
        console.log("getting stocks : " + symbol)
        const userRef = db.collection('stocks').doc(symbol);
      const doc = await userRef.get();
        if (!doc.exists) {
          console.log('No such stock!');
          return null;
        } else {
          const result = doc.data();
          let desc = await client.hgetAsync('company_info', symbol);
          
          if (desc === "null") {
            const API_KEY = process.env.finnhub_key;
            const API_Call4 =
              `https://www.alphavantage.co/query?function=OVERVIEW&symbol=` +
              symbol +
              `&apikey=` +
              API_KEY;
          
              const { data } = await axios.get(API_Call4);
              console.log(`This is the symbol ${symbol} ${data}`);
            let isDataNull = false;
            if (!data || Object.keys(data).length === 0) {
              await client.hsetAsync('company_info', symbol, JSON.stringify(null));
              isDataNull = true;
            } else {
                if (data.Note) { // sus
                    return null;
                }
              await client.hsetAsync('company_info', symbol, JSON.stringify(data));
            }

            if (isDataNull) {
                result.stockInfo = {
                  assetType: null,
                  description: null,
                  exchange: null,
                  industry: null,
                  analystTargetPrice: null
                }
            } else {
                let getFromRedis = await client.hgetAsync('company_info', symbol)
                let moreInfo = JSON.parse(getFromRedis);
                //console.log(moreInfo)
                let stockInfo = {}
                stockInfo.assetType = moreInfo.AssetType
                stockInfo.description = moreInfo.Description;
                stockInfo.exchange = moreInfo.Exchange;
                stockInfo.industry = moreInfo.Industry;
                stockInfo.analystTargetPrice = moreInfo.AnalystTargetPrice;
                result.stockInfo = stockInfo;
            }
                
           
          } else {
            let moreInfo = JSON.parse(desc);
            //console.log(moreInfo)
            let stockInfo = {}
            stockInfo.assetType = moreInfo.AssetType
            stockInfo.description = moreInfo.Description;
            stockInfo.exchange = moreInfo.Exchange;
            stockInfo.industry = moreInfo.Industry;
            stockInfo.analystTargetPrice = moreInfo.AnalystTargetPrice;
            result.stockInfo = stockInfo;
          }
          return result;
        }
  },

  async addStock(symbol) {
    try {
      //do alphavantage call here
      if (!symbol) throw "Stock symbol does not exist";

      const duplicateCheck = await db.collection('stocks').doc(symbol).get();
      if (duplicateCheck.exists) {
        console.log(`${symbol} is already in the database!`)
        return await module.exports.getStock(symbol);
      }
      
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
            counter++;
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
            counter++;
          }

        });
    
      const API_Call4 =
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=` +
        symbol +
        `&apikey=` +
        API_KEY;
    
      const { data } = await axios.get(API_Call4);
      if (Object.keys(data).length === 0) await client.hsetAsync('company_info', symbol, JSON.stringify(null));
      else await client.hsetAsync('company_info', symbol, JSON.stringify(data));

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
    
    console.log("Adding the following tickers to the firebase \'stocks\' collection:", tickers);

    for (let i = 0; i < tickers.length; i++) {
      const delay = ms => new Promise(res => setTimeout(res, ms));

      const duplicateCheck = await db.collection('stocks').doc(tickers[i].stock).get();
      if (duplicateCheck.exists) {
        console.log(`${tickers[i].stock} is already in the database!`)
        continue;
      }

        await module.exports.addStock(tickers[i].stock);
        await roomData.addRoom(tickers[i].stock);
        await module.exports.updateMentions([tickers[i]]);
        await delay(60000);
    }
    console.log("Done!");
    return await module.exports.getAllStocks();
  },

  async wipeStocks(allStocks = []) {
    console.log("here in wipe stocks", allStocks)
    if (allStocks.length === 0) {
        let all = await module.exports.getAllStocks();
        console.log(all);
        all.forEach((stock) => {
            allStocks.push(stock.symbol)
      })
    }
    for (let stock of allStocks) {
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
      await module.exports.deleteStockFromStockMentions(allStocks[i])
      await userData.removeFromAllFavorites(allStocks[i])
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
    try {
      for (let { stock, timesCounted } of tickerMentions) {
        const res = await db.collection('stockMentions').doc(stock).set({ "symbol": stock, "timesCounted": timesCounted });
      }
    } catch (e) {
      throw e
   } 
  },

  async getTopMentions() {
    try {
      const allStockMentions = await db.collection('stockMentions').get();
      
      let arr = [];
      allStockMentions.forEach((item) => {
        arr.push(item.data())
      })
        
        arr = arr.sort((a, b) => {return b.timesCounted - a.timesCounted});

      let getRooms = await Promise.all(arr.map(async ({ symbol, timesCounted}) => {
        return await roomData.getRoom(symbol)
      }))
      getRooms = getRooms.length > 10 ? getRooms.slice(0, 10) : getRooms;
      return getRooms;
      

    } catch (e) {
      throw e
    }
  },

  async deleteStockFromStockMentions(stockSymbol) {
    try {
      const res = await db.collection('stockMentions').doc(stockSymbol).delete();
      return 0; //success
    } catch (e) {
      throw e;
    }
  }

}