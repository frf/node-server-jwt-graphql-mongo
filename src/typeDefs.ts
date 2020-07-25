import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Token {
    token: String!
    token_refresh: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): Token!
    login(email: String!, password: String!): Token
  }
`;
