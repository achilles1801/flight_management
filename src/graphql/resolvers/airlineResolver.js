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

export const AirlineMutation = {
  addAirline: {
    type: AirlineType,
    args: {
      airlineID: { type: GraphQLString },
      revenue: { type: GraphQLInt }
    },
    resolve(parent, args, {userRoles}) {
      // Check if the user has the 'admin' role
      console.log(userRoles);
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
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

