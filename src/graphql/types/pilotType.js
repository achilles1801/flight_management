import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

const PilotType = new GraphQLObjectType({
  name: 'Pilot',
  fields: () => ({
    personID: { type: GraphQLString },
    taxID: { type: GraphQLString },
    experience: { type: GraphQLInt },
    commanding_flight: { type: GraphQLString }
  })
});

export default PilotType;
