// src/graphql/schema.js
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { AirlineQuery, AirlineMutation } from './resolvers/airlineResolver.js';
import { FlightQuery, FlightMutation } from './resolvers/flightResolver.js';


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ...AirlineQuery,
    ...FlightQuery,
    // ... add other queries here
  },
});


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...AirlineMutation,
    ...FlightMutation,
    // ... add other mutations here
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
