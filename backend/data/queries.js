const { gql } = require("apollo-server-express");
const passwordHash = require("password-hash");

/* Firebase Data Module Imports*/
const data = require("../data");
const userData = data.users;
const stockData = data.stocks;
const roomData = data.rooms;

const typeDefs = gql`
  type User {
    username: String!
    favorites: [Stock]
    userID: ID!
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
    getUserById(id: String!): User
    getStock(symbol: String!): Stock
    getRoom(stockSymbol: String!): Room
    
    checkUsername(username: String!): Boolean
  }

  type Mutation {
    addUser(username: String!, userID: ID!): User
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
    getUserById: async (_, args) => await userData.getUserById(args.id),
    checkUsername: async (_, args) => await userData.checkUsername(args.username),

    /* Stocks */
    stocks: async (_, args) => await stockData.getAllStocks(),
    getStock: async (_, args) => await stockData.getStock(args.symbol),
    
    /* Rooms */
    rooms: async (_, args) => await roomData.getAllRooms(),
    getRoom: async (_, args) => await roomData.getRoom(args.stockSymbol),
  },

  Mutation: {
    /* User */
    addUser: async (_, args) => {
      return await userData.addUser(args.username, args.userID);
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
