import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

const PassengerType = new GraphQLObjectType({
  name: 'Passenger',
  fields: () => ({
    personID: { type: GraphQLString },
    miles: { type: GraphQLInt },
    funds: { type: GraphQLInt }
  })
});

export default PassengerType;
