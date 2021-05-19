const passwordHash = require("password-hash");

//connect to firebase
const firebaseConnections = require("../config/firebaseConnections");
const db = firebaseConnections.initializeCloudFirebase();
const admin = require('firebase-admin');
 
module.exports = {
    /* gets all documents in users */
    async getAllUsers() {
      const snapshot = await db.collection('users').get();
      let arr = [];
      snapshot.forEach(doc => {
        arr.push(doc.data());
      });
      return arr;
    },
    
  /*  gets individual user */
    async getUser(username) {
        const userRef = db.collection('users').doc(username);
        const doc = await userRef.get();
        if (!doc.exists) {
          throw "User does not exist";
        } else {
          return doc.data();
        }
  },
    
  async getUserById(userId) {
        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();
        if (!doc.exists) {
          throw "User does not exist";
        } else {
          return doc.data();
        } 
  },
    
  async updateUser(newuserData) {
    try {
      const res = await db.collection('users').doc(newuserData.username).set(newuserData);
      return this.getUserById(newuserData.userID)
    } catch (e) {
      throw e;
      }
    },
    
    async getUserById(id) {
      const userRef = db.collection('users');
      const snapshot = await userRef.where('userID', "==", id).get();
        if (snapshot.empty) {
        throw "UserId does not exist";
      }  

      let output = {};
      snapshot.forEach(doc => {
        output = doc.data();
      });
      return output;
    },
    
    /* adds user */
  async addUser(username, userID) {
      //check if user exists
      const userRef = db.collection('users').doc(username);
      const doc = await userRef.get();
      if (doc.exists) {
        throw "User already exists";
      }

      let newUser = {
        username: username,
        userID: userID,
        favorites: []
      };

      const res = await db.collection('users').doc(username).set(newUser);
      return this.getUser(username);
    },

  checkUsername: async (username) => {
      const userRef = db.collection('users').doc(username);
      const doc = await userRef.get();
      if (doc.exists) {
        return true;
      }
      return false;
  },
  
  async addFavorites(userToken, stockSymbol) {
    let user;
    try {
      user = (await admin.auth().verifyIdToken(userToken));
    } catch (e) {
      return e;
    }
    try {
      let userDataToUpdate = await module.exports.getUserById(user.uid);
      let addToFavorites = userDataToUpdate.favorites;
      addToFavorites.push(stockSymbol)
      let setAddToFav = new Set(addToFavorites);
      userDataToUpdate.favorites = Array.from(setAddToFav);
      let ret = await this.updateUser(userDataToUpdate);
      return ret
    } catch (e) {
      throw e;
    }
  },

    async removeFromAllFavorites(stockSymbol) {
    try {
        let allUsers = await module.exports.getAllUsers();
        for (let user of allUsers) {
            if (user.favorites.includes(stockSymbol)) {
                let newFavorites = user.favorites.filter((stock) => {
                return stock !== stockSymbol
            })
            user.favorites = newFavorites;
            await module.exports.updateUser(user);
        }
      }
      return await module.exports.getAllUsers();
    } catch (e) {
      throw e;
    }
  },

  async removeFromFavorites(userToken, stockSymbol) {
    let user;
    try {
      user = await admin.auth().verifyIdToken(userToken);
    } catch (e) {
      return e;
    }

    try {
      let userDataToUpdate = await module.exports.getUserById(user.uid);
      let removeFromFavorites = userDataToUpdate.favorites;
      
      if (removeFromFavorites.includes(stockSymbol)) {
        let newFavorites = removeFromFavorites.filter((stock) => {
          return stock !== stockSymbol
        })
    
        userDataToUpdate.favorites = newFavorites;
        await this.updateUser(userDataToUpdate)
      } else {
        throw "The stock " + stockSymbol + " is not in the user's favorites"
      }
    } catch (e) {
      throw e;
    }
  },

  async getUserFavorites(userToken) {
    const roomData = require('./rooms')
    let user;
    try {
      user = await admin.auth().verifyIdToken(userToken);
    } catch (e) {
      return e;
    }

    try {
      let getUserData = await module.exports.getUserById(user.uid);
      let rooms = await Promise.all(getUserData.favorites.map(async (stock) => {
        return await roomData.getRoom(stock);
      }));
      return rooms;
    } catch (e) {
      throw e;
    }
  }
};
    