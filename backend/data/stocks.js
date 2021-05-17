//connect to firebase
const firebaseConnections = require("../config/firebaseConnections");
const db = firebaseConnections.initializeCloudFirebase();

const roomData = require("./rooms.js");

const fetch = require("node-fetch");
const { database } = require("firebase-admin");
const { generate } = require("password-hash");

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
    //do alphavantage call here
    if (!symbol) throw "Stock symbol does not exist";
    
    const API_KEY = "GLS602AYJC0P3DKO";

    const API_Call =
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=` +
      symbol +
      `&apikey=` +
      API_KEY;
    
    let newStock = {
      symbol: symbol,
      name: "NA",
      prices: [],
      chart: [],
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
            newStock.chart.unshift({ date: key, value: current });
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
      `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=` +
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
        for (var key in data["Monthly Adjusted Time Series"]) {
          let current = data["Monthly Adjusted Time Series"][key]["4. close"];
          current = parseFloat(current);
         
          if (counter == 6) {
            newStock.prices.push({ date: "6m", value: current });
          }
          if (counter == 12) {
            newStock.prices.push({ date: "1y", value: current });
          }
          if (counter == 60) {
            newStock.prices.push({ date: "5y", value: current });
          }
          counter++;
        }

      });
    
    
    
    if (newStock.prices === []) {
      console.log("Did not update " + symbol)
      return;
    }

    // Add a new document in collection "users" with ID 'username'
    const res = await db.collection('stocks').doc(symbol).set(newStock);
    return await this.getStock(symbol);
  },

  async generateStocks(tickers) {
    //web scrapper do this part
    let presets = ["COIN", "MSFT", "AAPL", "DASH", "SNAP", "TSLA", "NFLX", "GOOG", "FB", "DIS"];
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

  async wipeStocks() {
    let allStocks = await module.exports.getAllStocks();
    let allSymbols = [];
    for (let stock of allStocks) {
        allSymbols.push(stock.symbol)
        db.collection('stocks').doc(stock.symbol).delete().then(() => {
          console.log('successfully deleted ' + stock.symbol)
          
            //await roomData.deleteRoom(stock.symbol);
        }).catch((error) => {
          console.log('error deleting ' + stock.symbol)
          console.log(error)
        }) 
    }

    for (let i = 0; i < allSymbols.length; i++) {
        await roomData.deleteRoom(allSymbols[i])
    }

    return await module.exports.getAllStocks();
  }
}