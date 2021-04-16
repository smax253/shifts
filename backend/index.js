const express = require("express");
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

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