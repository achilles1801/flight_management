import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

const PassengerVacationsType = new GraphQLObjectType({
  name: 'PassengerVacations',
  fields: () => ({
    personID: { type: GraphQLString },
    airportID: { type: GraphQLString },
    sequence: { type: GraphQLInt }
  })
});

export default PassengerVacationsType;
