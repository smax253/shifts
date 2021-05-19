const { ApolloClient, gql, HttpLink, InMemoryCache } = require('@apollo/client/core');
const admin = require('firebase-admin');

const fetch = require('cross-fetch');

const serviceAccount = require('../config/serviceAccountKey');
const rooms = require('../data/rooms');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount)},"socket");
console.log("socket init firebase successful");

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: process.env.backend_uri,
        fetch
    })
})

const queries = {
    ADD_MESSAGE: gql`
        mutation($symbol: String!, $author: String!, $text: String!){
            addMessage(stockSymbol: $symbol, author: $author, text: $text){
                stockSymbol
            }
        }
    `,
    GET_USERNAME: gql`
        query($id: String!){
            getUserById(id: $id){
                username
            }
        }
    `
}
const initSocketIO = (httpServer, workerPassword) => {
    const io = require('socket.io')(httpServer, {
        cors: {
            origin: process.env.frontend_uri,
            methods: ["GET", "POST"],
        }
    });

    io.on("connection", async (socket) => {
        const userToken = socket.handshake.query.userToken;
        
        if (userToken === workerPassword) {
            socket.on('price-update', (symbol, price) => {
                console.log('socket emitting', symbol, price);
                io.to(symbol).emit('price', price);
            })
            return;
        }
        let uid;
        try {
            let user = await admin.auth().verifyIdToken(userToken);
            //console.log(user);
            uid = user.uid;
        } catch (err) {
            return socket.disconnect(true);
        }
    //    console.log('user token')
        const { data } = await client.query({ query: queries.GET_USERNAME, variables: { id: uid } });
        const username = data.getUserById.username;
        const symbol = socket.handshake.query.symbol;
        if (!symbol) return socket.disconnect(true);
        socket.join(symbol);
        const room = await rooms.addUserToRoom(username, symbol);
        console.log(room);
        socket.on('message', async (message) => {
            await client.mutate({
                mutation: queries.ADD_MESSAGE,
                variables: {
                    text: message,
                    symbol,
                    author: username
                }
            });
            const newMessage = {
                text: message,
                time: new Date().getTime(),
                author: username,
            }
            io.sockets.to(symbol).emit('chat', newMessage);
        });
        io.sockets.to(symbol).emit('users-update', room.activeUsers);
        socket.on('disconnect', async () => {

            const newroom = await rooms.deleteUserFromRoom(username, symbol);
            io.sockets.to(symbol).emit('users-update', newroom.activeUsers);

        })
    })
}



module.exports = initSocketIO;


