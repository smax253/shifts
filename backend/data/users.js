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
      const res = await db.collection('users').doc(newuserData.userID).set(newuserData);
      return this.getUserById(newuserData.username)
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
      let setAddToFav = Array.from(new Set(addToFavorites.push(stockSymbol)));
      userDataToUpdate.favorites = setAddToFav;
      await this.updateUser(userDataToUpdate);
    } catch (e) {
      throw e;
    }
  },

  async removeFromFavorites(userToken, stockSymbol) {
    let user;
    try {
      user = 
    }
  }
};
    