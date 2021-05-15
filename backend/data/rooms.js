//connect to firebase
const { addResolveFunctionsToSchema } = require("graphql-tools");
const firebaseConnections = require("../config/firebaseConnections");
const db = firebaseConnections.initializeCloudFirebase();

module.exports = {
    async getAllRooms() {
        const snapshot = await db.collection('rooms').get();
        let arr = [];
        snapshot.forEach(doc => {
            arr.push(doc.data());
        });
        console.log(arr);
        return arr;
    },

    async getRoom(stockSymbol) {
        const roomRef = db.collection('rooms').doc(stockSymbol);
        const doc = await roomRef.get();
        if (!doc.exists) {
          throw "Room does not exist";
        } else {
          return doc.data();
        }
    },

    async addRoom(stockSymbol) {
        let newRoom = {
            stockSymbol: stockSymbol,
            activeUsers: [],
            messages: [],
        };
        const res = await db.collection('rooms').doc(stockSymbol).set(newRoom);
        return this.getRoom(stockSymbol);
    },

    async addMessage(stockSymbol, author, text) {
        let today = new Date();
        let newMessage = {
            author: author,
            time: today,
            text: text
        }
        
        let roomData = await this.getRoom(stockSymbol);

        roomData.messages.push(newMessage);
        const res = await db.collection('rooms').doc(stockSymbol).set(roomData);
        return this.getRoom(stockSymbol);
    }
}