const { gql } = require("apollo-server-express");
const passwordHash = require("password-hash");

/* Firebase Data Module Imports*/
const data = require("../data");
const userData = data.users;
const stockData = data.stocks;
const roomData = data.room;

const typeDefs = gql`
  type User {
    username: String
    hashedPassword: String
  }

  type Company {
    symbol: String
    prices: [Int]
  }

  type Room {
    activeUsers: [User]
    messages: [String]
  }

  type Query {
    users: User
    getUser(username: String!): User
    stocks: Company
    login: String
  }

  type Mutation {
    addUser(username: String!, password: String!): User
    clearStocks: String
    generateStocks: String
  }
`;

const resolvers = {
  Query: {
    users: async () => await userData.getAllUsers(),
    getUser: async (_, args) => await userData.getUser(args.username),
    stocks: async (_, args) => console.log('TODO'),
    login: async (_, args) => console.log('TODO')
  },

  Mutation: {
    /* User */
    addUser: async (_, args) => {
      const hashedPassword = passwordHash.generate(args.password);
      return await userData.addUser(args.username, hashedPassword);
    },
    clearStocks: async (_, args) => console.log('TODO'),
    generateStocks: async (_, args) => console.log('TODO')
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
