const passwordHash = require("password-hash");

//connect to firebase
const firebaseConnections = require("../config/firebaseConnections");
const db = firebaseConnections.initializeCloudFirebase();

module.exports = {
        async getAllUsers() {
        const snapshot = await db.collection('users').get();
        console.log(snapshot);
        return snapshot;
    },

    async getUser(username) {
        const cityRef = db.collection('users').doc(username);
        const doc = await cityRef.get();
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.data());
        }
        return doc.data();
    },
    
    async addUser(username, hashedPassword) {
      let newUser = {
        username: username,
        hashedPassword: hashedPassword,
      };

      console.log(newUser);
      
      // Add a new document in collection "users" with ID 'username'
      const res = await db.collection('users').doc(username).set(newUser);
      console.log(res);
      return res;
      },
};
    