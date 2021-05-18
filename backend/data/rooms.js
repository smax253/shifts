//connect to firebase
const { addResolveFunctionsToSchema } = require("graphql-tools");
const firebaseConnections = require("../config/firebaseConnections");
const db = firebaseConnections.initializeCloudFirebase();

const userData = require('./users');

module.exports = {
    async getAllRooms() {
        const snapshot = await db.collection('rooms').get();
        let arr = [];
        snapshot.forEach(doc => {
            arr.push(doc.data());
        });
        return arr;
    },

    async getRoom(stockSymbol) {
        const roomRef = db.collection('rooms').doc(stockSymbol);
        const doc = await roomRef.get();
        if (!doc.exists) {
          throw "Room does not exist";
        } else {
          const data = doc.data();
          data.messages = data.messages.map((item) => {
            return {
              ...item,
              time: item.time.toDate()
            }
          })
          return data;
        }
    },

    async deleteRoom(stockSymbol) {
        db.collection('rooms').doc(stockSymbol).delete().then(() => {
            console.log('successfully deleted room ' + stockSymbol)
        }).catch((error) => {
            console.log('unable to delete room ' + stockSymbol);
            console.log(error)
        });
        return this.getAllRooms();
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
    },

    async updateRoom(newRoomData, stockSymbol) {
        try {
            const res = await db.collection('rooms').doc(stockSymbol).set(newRoomData);
            return this.getRoom(stockSymbol);
        } catch (e) {
            throw (e);
        }
    },

    async addUserToRoom(userName, stockSymbol) {
        console.log(stockSymbol)
        try {
            let user = await userData.getUser(userName)
            let room = await module.exports.getRoom(stockSymbol);
            room.activeUsers.push(userName);
            room.activeUsers = Array.from(new Set(room.activeUsers));
            await this.updateRoom(room, stockSymbol);
        } catch (e) {
            throw (e);
        }
    },

    async deleteUserFromRoom(userName, stockSymbol) {
        try {
            let room = await module.exports.getRoom(stockSymbol);

            if (room.activeUsers.includes(userName)) {
                let newRoom = room.activeUsers.filter((users) => {
                    return users !== userName;
                })
                room.activeUsers = newRoom;
                await this.updateRoom(room, stockSymbol);
            } else {
                throw "That user is not in the room " + stockSymbol;
            }
        } catch (e) {
            throw e;
        }
    }
}