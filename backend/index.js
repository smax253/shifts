console.log('env', process.env.private_key);


const express = require("express");
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs, resolvers} = require("./data/queries");
const { Worker } = require("worker_threads");

let scraperWorker = new Worker('./api/script.js');
//require('./socket')

async function startApolloServer() {

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    const app = express();
    server.applyMiddleware({ app });

    await new Promise(resolve => app.listen({ port: process.env.PORT || 4000 }, resolve));
    console.log(`🚀 Server ready at ${process.env.PORT ? 'port: '+process.env.PORT : `http://localhost:4000${server.graphqlPath}`}`);
    return { server, app };
};

startApolloServer();