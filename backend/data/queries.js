const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: String
    email: String
    username: String
    hashedPassword: String
  }

  type Company {
    _id: String
    email: String
    username: String
    hashedPassword: String
  }

  type Query {
    users: [User]
    companies: [Company]

    userByID(id: String): User
    companyByID(id: String): Company
    companyByTicker(ticker: String): Company
  }

  type Mutation {
    addUser(email: String!, username: String!, password: String!): User
    deleteUser(id: String!): User

    addCompany(ticker: String!, companyName: String!, banner: String!): Company
    updateCompanyPrices(companyId: String!): Company
    deleteCompany(id: String!): Company
  }
`;

const resolvers = {
  Query: {
    // users: async () => await userData.getAllUsers(),
    // companies: async () => await companyData.getAllCompanies(),

    // userByID: async (_, args) => await userData.getUserByID(args.id),
    // companyByID: async (_, args) => await companyData.getCompanyByID(args.id),

    // companyByTicker: async (_, args) =>
    //   await companyData.getCompanyByTicker(args.ticker),

    // login: async (_, args, context) =>
    //   await userData.login(args.email, args.password, context),
  },

  Mutation: {
    // /* User */
    // addUser: async (_, args) => {
    //   const hashedPassword = passwordHash.generate(args.password);
    //   return await userData.addUser(args.email, args.username, hashedPassword);
    // },
    // deleteUser: async (_, args) => {
    //   return await userData.deleteUser(args.id);
    // },

    // /* Company */
    // addCompany: async (_, args) => {
    //   return await companyData.addCompany(
    //     args.ticker,
    //     args.companyName,
    //     args.banner
    //   );
    // },
    // updateCompanyPrices: async (_, args) => {
    //   return await companyData.updateCompanyPrices(args.companyId);
    // },
    // deleteCompany: async (_, args) => {
    //   return await companyData.deleteCompany(args.id);
    // },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
