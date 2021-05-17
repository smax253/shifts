const express = require("express");
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs, resolvers} = require("./data/queries");
const { Worker } = require("worker_threads");
require('./socket')

let scraperWorker = new Worker('./api/script.js');

async function startApolloServer() {
const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    const app = express();
    server.applyMiddleware({ app });

    await new Promise(resolve => app.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    return { server, app };
};

startApolloServer();