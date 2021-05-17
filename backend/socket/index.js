const { ApolloClient, gql, HttpLink, InMemoryCache } = require('@apollo/client/core');
const admin = require('firebase-admin');
const io = require('socket.io')(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});
const fetch = require('cross-fetch');

const serviceAccount = require('../config/serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount)},"socket");
console.log("socket init firebase successful");

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: "http://localhost:4000/graphql",
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
    `
}

io.use(async (socket, next) => {
    
    /*try {
        const { uid } = await admin.auth().verifyIdToken(userToken);
        socket.uid = uid;
        return next();
    } catch (err) {
        return next(err);
    }*/
    next();

})

io.on("connection", (socket) => {
    const userToken = socket.handshake.query.userToken;
    /*try {
        const { uid } = await admin.auth().verifyIdToken(userToken);
        socket.uid = uid;
    } catch (err) {
        return socket.disconnect(true);
    }*/
    const symbol = socket.handshake.query.symbol;
    console.log('symbol', symbol);
    console.log('uid', socket.uid);
    if (!symbol) return socket.disconnect(true);
    socket.join(symbol);
    socket.on('message', async (message) => {
        console.log(message);
        const username = 'username';
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
            time: new Date(),
            author: username,
        }
        io.emit('message', newMessage);
    })
})

const sendStockData = (symbol, price) => {
    io.to(symbol).emit('price', price);
}

module.exports = sendStockData;


