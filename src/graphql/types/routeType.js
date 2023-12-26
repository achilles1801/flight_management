import { GraphQLObjectType, GraphQLString } from 'graphql';

const RouteType = new GraphQLObjectType({
  name: 'Route',
  fields: () => ({
    routeID: { type: GraphQLString }
  })
});

export default RouteType;
