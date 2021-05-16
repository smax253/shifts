const { gql } = require("apollo-server-express");
const passwordHash = require("password-hash");

/* Firebase Data Module Imports*/
const data = require("../data");
const userData = data.users;
const stockData = data.stocks;
const roomData = data.rooms;

const typeDefs = gql`
  type User {
    username: String
    hashedPassword: String
  }

  type Stock {
    symbol: String
    prices: [Price]
    chart: [Price]
  }

  type Price {
    date: String
    value: Float
  }

  type Room {
    stockSymbol: String
    activeUsers: [User]
    messages: [Message]
  }

  type Message {
    author: String
    time: String
    text: String
  }

  type Query {
    users: [User]
    stocks: [Stock]
    rooms: [Room]

    getUser(username: String!): User
    getStock(symbol: String!): Stock
    getRoom(stockSymbol: String!): Room

    login(username: String!, password: String!): User
  }

  type Mutation {
    addUser(username: String!, password: String!): User
    addStock(symbol: String!, prices: [Int]): Stock
    addRoom(stockSymbol: String!): Room
    addMessage(stockSymbol: String!, author: String!, text: String): Room

    clearStocks: [Stock]
    generateStocks: [Stock]
  }
`;

const resolvers = { 
  Query: {
    /* Users */
    users: async () => await userData.getAllUsers(),
    getUser: async (_, args) => await userData.getUser(args.username),
    login: async (_, args) => await userData.login(args.username, args.password),

    /* Stocks */
    stocks: async (_, args) => await stockData.getAllStocks(),
    getStock: async (_, args) => await stockData.getStock(args.symbol),
    
    /* Rooms */
    rooms: async (_, args) => console.log('TODO'),
    getRoom: async (_, args) => console.log('TODO'),
  },

  Mutation: {
    /* User */
    addUser: async (_, args) => {
      const hashedPassword = passwordHash.generate(args.password);
      return await userData.addUser(args.username, hashedPassword);
    },
    addStock: async (_, args) => {
      return await stockData.addStock(args.symbol);
    },
    addRoom: async (_, args) => {
      return await roomData.addRoom(args.stockSymbol);
    },
    addMessage: async (_, args) => {
      return await roomData.addMessage(args.stockSymbol, args.author, args.text);
    },

    clearStocks: async (_, args) => console.log('TODO'),
    generateStocks: async (_, args) => {
      return await stockData.generateStocks();
    }
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
