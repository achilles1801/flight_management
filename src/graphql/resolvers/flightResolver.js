import { GraphQLString, GraphQLInt } from 'graphql';
import FlightType from '../types/flightType.js';
import db from '../../database.js'; // Adjust the path as needed

export const FlightQuery = {
  flight: {
    type: FlightType,
    args: { flightID: { type: GraphQLString } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM flight WHERE flightID = ?', [args.flightID], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results[0]);
        });
      });
    }
  },
  // Other queries can be added here
};

export const FlightMutation = {
  addFlight: {
    type: FlightType,
    args: {
      flightID: { type: GraphQLString },
      routeID: { type: GraphQLString },
      support_airline: { type: GraphQLString },
      support_tail: { type: GraphQLString },
      progress: { type: GraphQLInt },
      airplane_status: { type: GraphQLString },
      next_time: { type: GraphQLString }, // Adjust the type if needed
      cost: { type: GraphQLInt }
    },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        const { flightID, routeID, support_airline, support_tail, progress, airplane_status, next_time, cost } = args;
        db.query('INSERT INTO flight (flightID, routeID, support_airline, support_tail, progress, airplane_status, next_time, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                 [flightID, routeID, support_airline, support_tail, progress, airplane_status, next_time, cost], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(args); // Return the newly created flight
        });
      });
    }
  },
  // Other mutations can be added here
};

// Export the resolvers
export default {
  FlightQuery,
  FlightMutation
};
