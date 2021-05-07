const passwordHash = require("password-hash");
const firebaseConnections = require("../config/firebaseConnections");

const db = firebaseConnections.initializeCloudFirebase();

module.exports = {
        async getAllUsers() {
        const snapshot = await db.collection('users').get();
        snapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    },

    async addUser(email, username, hashedPassword) {
        const usersCollection = await users();
        let newUser = {
          email: email,
          username: username,
          hashedPassword: hashedPassword,
          friends: [],
        };
        const insertInfo = await usersCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw "Could not add user";
        const newId = insertInfo.insertedId;
        return await this.getUserByID(newId);
      },
};
    