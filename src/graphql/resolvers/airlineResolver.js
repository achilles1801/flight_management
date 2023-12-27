// src/graphql/resolvers/airlineResolver.js
import { GraphQLString, GraphQLInt } from 'graphql';
import AirlineType from '../types/airlineType.js';
import db from '../../database.js'; // Adjust the path as needed


export const AirlineQuery = {
  airline: {
    type: AirlineType,
    args: { airlineID: { type: GraphQLString } },
    resolve(parent, args) {
      // Replace with actual database query
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM airline WHERE airlineID = ?', [args.airlineID], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results[0]);
        });
      });
    }
  },
  // ...other queries
};

const checkIfAuthorized = (user) => {
  return user && user.role === 'admin';
};

export const AirlineMutation = {
  addAirline: {
    type: AirlineType,
    args: {
      airlineID: { type: GraphQLString },
      revenue: { type: GraphQLInt }
    },
    resolve(parent, args, context) {
      // Check if user is authorized
      if (!checkIfAuthorized(context.user)) {
        throw new Error('Not authorized!');
      }
      return new Promise((resolve, reject) => {
        db.query('INSERT INTO airline (airlineID, revenue) VALUES (?, ?)', 
                 [args.airlineID, args.revenue], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve({ airlineID: args.airlineID, revenue: args.revenue });
        });
      });
    }
  },
  // ...other mutations
};

