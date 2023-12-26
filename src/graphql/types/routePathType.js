import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';

const RoutePathType = new GraphQLObjectType({
  name: 'RoutePath',
  fields: () => ({
    routeID: { type: GraphQLString },
    legID: { type: GraphQLString },
    sequence: { type: GraphQLInt }
  })
});

export default RoutePathType;
