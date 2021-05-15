const { gql } = require("apollo-server-express");
const passwordHash = require("password-hash");

/* Firebase Data Module Imports*/
const data = require("../data");
const userData = data.users;
const stockData = data.stocks;

const typeDefs = gql`
  type User {
    username: String
    hashedPassword: String
  }

  type Company {
    symbol: String
    price: Int
  }

  type Room {
    activeUsers: [User]
    messages: [String]
  }

  type Query {
    users: [User]
    login: String
  }

  type Mutation {
    addUser(username: String!, password: String!): User
  }
`;

const resolvers = {
  Query: {
    users: async () => await userData.getAllUsers(),
    login: async (_, args, context) => console.log('TODO')
  },

  Mutation: {
    /* User */
    addUser: async (_, args) => {
      const hashedPassword = passwordHash.generate(args.password);
      return await userData.addUser(args.username, hashedPassword);
    },

    // fetchCompany: async (_, args) => {
    //   console.log('TODO');
    // }
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
