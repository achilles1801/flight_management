// src/graphql/schema.js
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { AirlineQuery, AirlineMutation } from './resolvers/airlineResolver.js';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ...AirlineQuery,
    // ... add other queries here
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...AirlineMutation,
    // ... add other mutations here
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
