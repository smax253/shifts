const express = require("express");
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs, resolvers} = require("./data/queries");
const { Worker } = require("worker_threads");
const crypto = require('crypto');
const http = require('http');

const initSocketIO = require('./socket')

async function startApolloServer() {
    const password = crypto.randomBytes(20).toString('hex');
    const socketioport = process.env.PORT || 4000;
    

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    const app = express();
    server.applyMiddleware({ app });

    const httpServer = http.createServer(app);
    initSocketIO(httpServer, password, socketioport);
    // let scraperWorker = new Worker('./api/script.js', {workerData: {password, socketioport}});

    httpServer.listen(process.env.PORT || 4000);
    //await new Promise(resolve => app.listen({ port: process.env.PORT || 4000 }, resolve));
    console.log(`🚀 Server ready at ${process.env.PORT ? 'port: '+process.env.PORT : `http://localhost:4000${server.graphqlPath}`}`);
    return { server, app };
};

startApolloServer();