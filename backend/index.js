const express = require("express");
const { ApolloServer, gql } = require('apollo-server-express');
const admin = require('firebase-admin');

const app = express();

function initializeAppSA() {

  let serviceAccount = require('./config/serviceAccountKey.json');

  admin.initializeApp({
    //credential: admin.credential.applicationDefault(),
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://xxxxx.firebaseio.com"
  });

  let db = admin.firestore();

  return db;
}
const db = initializeAppSA();
let docRef = db.collection('users').doc('alovelace');

let setAda = docRef.set({
  first: 'Ada',
  last: 'Lovelace',
  born: 1815
});

const typeDefs = gql`
    type Query {
      hello: String
    }
  `;

  // Provide resolver functions for your schema fields
  const resolvers = {
    Query: {
      hello: () => 'Hello world!',
    },
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
  });
  server.applyMiddleware({ app });

  /* Runs server on port 4000 */
app.listen({ port: 4000 }, () =>
console.log("Now browse to http://localhost:4000" + server.graphqlPath)
);