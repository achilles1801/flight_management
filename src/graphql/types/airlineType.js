// src/graphql/types/airlineType.js
import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

const AirlineType = new GraphQLObjectType({
  name: 'Airline',
  fields: () => ({
    airlineID: { type: GraphQLString },
    revenue: { type: GraphQLInt }
  })
});

export default AirlineType;
