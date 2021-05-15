const passwordHash = require("password-hash");

//connect to firebase
const firebaseConnections = require("../config/firebaseConnections");
const db = firebaseConnections.initializeCloudFirebase();
 
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
    
    /* adds user */
  async addUser(username, hashedPassword) {
      //check if user exists
      const userRef = db.collection('users').doc(username);
      const doc = await userRef.get();
      if (doc.exists) {
        throw "User already exists";
      }

      let newUser = {
        username: username,
        hashedPassword: hashedPassword,
      };

      const res = await db.collection('users').doc(username).set(newUser);
      return this.getUser(username);
    },

    async login(username, password) {
      if (!username) throw "You must provide a username";
      if (!password) throw "You must provide a password";

      //checks if user exists
      const userRef = db.collection('users').doc(username);
      const doc = await userRef.get();
      if (!doc.exists || !passwordHash.verify(password, doc.data().hashedPassword)) {
        throw "Incorrect username or password";
      }
      
      return doc.data();
    }
};
    