import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';

const FlightType = new GraphQLObjectType({
  name: 'Flight',
  fields: () => ({
    flightID: { type: GraphQLString },
    routeID: { type: GraphQLString },
    support_airline: { type: GraphQLString },
    support_tail: { type: GraphQLString },
    progress: { type: GraphQLInt },
    airplane_status: { type: GraphQLString },
    next_time: { type: GraphQLString }, // Adjust the type if needed
    cost: { type: GraphQLInt }
  })
});

export default FlightType;
