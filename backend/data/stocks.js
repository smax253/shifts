//connect to firebase
const firebaseConnections = require("../config/firebaseConnections");
const db = firebaseConnections.initializeCloudFirebase();

module.exports = {
  async getAllStocks() {
      const snapshot = await db.collection('stocks').get();
      let arr = [];
      snapshot.forEach(doc => {
        arr.push(doc.data());
      });
      console.log(arr);
      return arr;
  },

  async getStock(symbol) {
         const userRef = db.collection('stocks').doc(symbol);
        const doc = await userRef.get();
        if (!doc.exists) {
          console.log('No such stock!');
        } else {
          console.log(doc.data());
          return doc.data();
        }
        return null;
  },
  
  async addStock(symbol, prices) {
    //do alphavantage call here
    let newStock = {
      symbol: symbol,
      prices: [],
    };
    // Add a new document in collection "users" with ID 'username'
    const res = await db.collection('stocks').doc(symbol).set(newStock);
    return getStock(username);
  },
}