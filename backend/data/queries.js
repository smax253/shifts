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
    favorites: [String]
    userID: ID!
  }

  type Indexes{
    NASDAQ: Stock
    DOW: Stock
    SP: Stock
  }

  type Stock {
    name: String
    symbol: String
    prices: [Price]
    chart: ChartData
    daily: [Price]
  }

  type ChartData{
    days: [Price]
    weeks: [Price]
  }

  type Price {
    date: String
    value: Float
  }

  type Room {
    stockSymbol: String
    activeUsers: [String]
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
    indexes: Indexes

    getUser(username: String!): User
    getUserById(id: String!): User
    getStock(symbol: String!): Stock
    getStocks(symbols: [String]!): [Stock]
    getRoom(stockSymbol: String!): Room
    topMovers: [Room]

    getTopMentions: [Room]
    
    getUserFavorites(userToken: String!): [Room]
    checkUsername(username: String!): Boolean
  }

  type Mutation {
    addUser(username: String!, userID: ID!): User
    addStock(symbol: String!, prices: [Int]): Stock
    updateStockData(symbol: String!): Stock
    addRoom(stockSymbol: String!): Room
    addMessage(stockSymbol: String!, author: String!, text: String): Room

    updateIndexes: Indexes

    clearStocks: [Stock]
    generateStocks: [Stock]
    
    removeFromFavorites(userToken: String!, stockSymbol:String!): User
    addToFavorites(userToken: String!, stockSymbol: String!): User


    addUserToRoom(username: String!, stockSymbol:String!): Room
    deleteUserFromRoom(username: String!, stockSymbol:String!): Room
  }
`;

const resolvers = { 
  Query: {
    /* Users */
    users: async () => await userData.getAllUsers(),
    getUser: async (_, args) => await userData.getUser(args.username),
    getUserById: async (_, args) => await userData.getUserById(args.id),
    checkUsername: async (_, args) => await userData.checkUsername(args.username),
    getUserFavorites: async (_, args) => userData.getUserFavorites(args.userToken, args.stockSymbol),
    

    /* Stocks */
    stocks: async (_, args) => await stockData.getAllStocks(),
    getStock: async (_, args) => await stockData.getStock(args.symbol),
    topMovers: async (_, args) => await stockData.topMovers(),
    getStocks: async (_, args) => await stockData.getStocks(args.symbols),
    indexes: async (_, args) => await stockData.indexes(),
    getTopMentions: async(_, args) => await stockData.getTopMentions(),
    
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
    updateStockData: async (_, args) => {
      return await stockData.updateStockData(args.symbol);
    },
    addRoom: async (_, args) => {
      return await roomData.addRoom(args.stockSymbol);
    },
    addMessage: async (_, args) => {
      return await roomData.addMessage(args.stockSymbol, args.author, args.text);
    },

    clearStocks: async (_, args) => {
      return await stockData.wipeStocks();
    },
    
    generateStocks: async (_, args) => {
      return await stockData.generateStocks(args.topTickerSymbols = []);
    },

    updateIndexes: async () => {
      return await stockData.updateIndexes();
    },

    addUserToRoom: async (_, args) => {
      return await roomData.addUserToRoom(args.username, args.stockSymbol)
    },

    deleteUserFromRoom: async (_, args) => {
      return await roomData.deleteUserFromRoom(args.username, args.stockSymbol)
    },
    
    addToFavorites: async (_, args) => {
      return await userData.addFavorites(args.userToken, args.stockSymbol)
    },

    removeFromFavorites: async (_, args) => {
      return await userData.removeFromFavorites(args.userToken, args.stockSymbol)
    }
    
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
