//connect to firebase
const firebaseConnections = require("../config/firebaseConnections");
const db = firebaseConnections.initializeCloudFirebase();


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
    
    const API_KEY = "YAYEHCCFPUK5S4J9";

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
        newStock.name = data["Name"];
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

    // console.log(newStock);
    // Add a new document in collection "users" with ID 'username'
    const res = await db.collection('stocks').doc(symbol).set(newStock);
    return await this.getStock(symbol);
  },

  async generateStocks() {
    //web scrapper do this part
    let arr = ["COIN", "MSFT", "AAPL", "GME", "T", "VZ", "NFLX", "GOOG"];
    for (let i = 0; i < arr.length; i++) {
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await this.addStock(arr[i]);
      await delay(60000);
    }
    console.log("Done!");
    return await this.getAllStocks();
  },

  async wipeStocks() {
    console.log("firing")
    let allStocks = await this.getAllStocks();
    allStocks.forEach((stock) => {
      db.collection('stocks').doc(stock.symbol).delete().then(() => {
        console.log('successfully deleted ' + stock.symbol)
      }).catch((error) => {
        console.log('error deleting ' + stock.symbol)
        console.log(error)
      })
    })
    return await this.getAllStocks();
  }
}