import exp from 'express';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from './graphql/schemas/typeDefs.js';
import { resolvers } from './graphql/resolvers/index.js';

const app = exp();
app.use(exp.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export { app, server };
