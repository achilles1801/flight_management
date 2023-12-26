import { GraphQLObjectType, GraphQLString, GraphQLID } from 'graphql';

const AirportType = new GraphQLObjectType({
  name: 'Airport',
  fields: () => ({
    airportID: { type: GraphQLID },
    airport_name: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    country: { type: GraphQLString },
    locationID: { type: GraphQLString }
  })
});

export default AirportType;
