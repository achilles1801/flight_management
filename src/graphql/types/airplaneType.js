import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';

const AirplaneType = new GraphQLObjectType({
  name: 'Airplane',
  fields: () => ({
    airlineID: { type: GraphQLString },
    tail_num: { type: GraphQLString },
    seat_capacity: { type: GraphQLInt },
    speed: { type: GraphQLInt },
    locationID: { type: GraphQLString },
    plane_type: { type: GraphQLString },
    skids: { type: GraphQLBoolean },
    propellers: { type: GraphQLInt },
    jet_engines: { type: GraphQLInt }
  })
});

export default AirplaneType;
