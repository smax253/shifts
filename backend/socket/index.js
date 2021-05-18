const { ApolloClient, gql, HttpLink, InMemoryCache } = require('@apollo/client/core');
const admin = require('firebase-admin');
const io = require('socket.io')(3001, {
    cors: {
        origin: process.env.frontend_uri,
        methods: ["GET", "POST"],
    }
});
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

io.on("connection", async (socket) => {
    const userToken = socket.handshake.query.userToken;
    let uid;
    try {
        uid = (await admin.auth().verifyIdToken(userToken)).uid;
    } catch (err) {
        return socket.disconnect(true);
    }
    const { data } = await client.query({ query: queries.GET_USERNAME, variables: { id: uid } });
    const username = data.getUserById.username;
    const symbol = socket.handshake.query.symbol;
    if (!symbol) return socket.disconnect(true);
    socket.join(symbol);
    await rooms.addUserToRoom(username, symbol);
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
    socket.on('disconnect', async () => {
        await rooms.deleteUserFromRoom(username, symbol);
    })
})

const sendStockData = (symbol, price) => {
    io.to(symbol).emit('price', price);
}

module.exports = sendStockData;


