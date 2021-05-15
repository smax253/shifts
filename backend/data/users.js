const passwordHash = require("password-hash");
const firebaseConnections = require("../config/firebaseConnections");

const db = firebaseConnections.initializeCloudFirebase();

module.exports = {
        async getAllUsers() {
        const snapshot = await db.collection('users').get();
        return snapshot;
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
    