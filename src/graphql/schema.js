// src/graphql/schema.js
import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { AirlineQuery, AirlineMutation } from './resolvers/airlineResolver.js';
import { FlightQuery, FlightMutation } from './resolvers/flightResolver.js';
import {AirplaneQuery, AirplaneMutation} from './resolvers/airplaneResolver.js';
import { LocationQuery, LocationMutation } from './resolvers/locationResolver.js';
import { AirportQuery, AirportMutation } from './resolvers/airportResolver.js';
import { PersonQuery, PersonMutation } from './resolvers/personResolver.js';
import { PassengerQuery, PassengerMutation } from './resolvers/passengerResolver.js';
import { PassengersVacationsQuery, PassengersVacationsMutation } from './resolvers/passengersVacationResolver.js';
import { PilotLicenseQuery, PilotLicenseMutation } from './resolvers/pilotLicensesResolver.js';
import { RouteQuery, RouteMutation } from './resolvers/routeResolver.js';
import { LegQuery, LegMutation } from './resolvers/legResolver.js';
import { RoutePathQuery, RoutePathMutation } from './resolvers/routePathResolver.js';


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ...AirlineQuery,
    ...FlightQuery,
    ...AirplaneQuery,
    ...LocationQuery,
    ...AirportQuery,
    ...PersonQuery,
    ...PassengerQuery,
    ...PassengersVacationsQuery,
    ...PilotLicenseQuery,
    ...RouteQuery,
    ...LegQuery,
    ...RoutePathQuery
    // ... add other queries here
  },
});


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...AirlineMutation,
    ...FlightMutation,
    ...AirplaneMutation,
    ...LocationMutation,
    ...AirportMutation,
    ...PersonMutation,
    ...PassengerMutation,
    ...PassengersVacationsMutation,
    ...PilotLicenseMutation,
    ...RouteMutation,
    ...LegMutation,
    ...RoutePathMutation
    // ... add other mutations here
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
