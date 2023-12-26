import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

const LegType = new GraphQLObjectType({
  name: 'Leg',
  fields: () => ({
    legID: { type: GraphQLString },
    distance: { type: GraphQLInt },
    departure: { type: GraphQLString },
    arrival: { type: GraphQLString }
  })
});

export default LegType;
