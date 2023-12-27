// src/graphql/resolvers/airportResolver.js
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList, GraphQLInt } from 'graphql';
import db from '../../database.js'; // Adjust the path as needed
import AirportType from '../types/airportType.js'; // Adjust the path as needed

export const AirportQuery = {
  // Get a single airport by ID
  airport: {
    type: AirportType,
    args: { airportID: { type: GraphQLString } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM airport WHERE airportID = ?', [args.airportID], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results[0] || null);
        });
      });
    }
  },
  // Get all airports
  airports: {
    type: new GraphQLList(AirportType),
    resolve() {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM airport', (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });
    }
  }
};

export const AirportMutation = {
  // Add Airport Mutation
  addAirport: {
    type: AirportType,
    args: {
      airportID: { type: new GraphQLNonNull(GraphQLString) },
      airport_name: { type: GraphQLString },
      city: { type: GraphQLString },
      state: { type: GraphQLString },
      country: { type: GraphQLString },
      locationID: { type: GraphQLString }
    },
    resolve(parent, args, {userRoles}) {
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
      }
      return new Promise((resolve, reject) => {
        db.query('INSERT INTO airport (airportID, airport_name, city, state, country, locationID) VALUES (?, ?, ?, ?, ?, ?)',
          [args.airportID, args.airport_name, args.city, args.state, args.country, args.locationID], 
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve(args);
            }
          }
        );
      });
    }
  },

  // Update Airport Mutation
  updateAirport: {
    type: AirportType,
    args: {
      airportID: { type: new GraphQLNonNull(GraphQLString) },
      airport_name: { type: GraphQLString },
      city: { type: GraphQLString },
      state: { type: GraphQLString },
      country: { type: GraphQLString },
      locationID: { type: GraphQLString }
    },
    resolve(parent, args, {userRoles}) {
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
      }
      const { airportID, ...updateValues } = args;
      const fields = Object.keys(updateValues).filter(key => updateValues[key] != null);
      const values = fields.map(key => updateValues[key]);

      return new Promise((resolve, reject) => {
        db.query(`UPDATE airport SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE airportID = ?`,
          [...values, airportID], (error) => {
            if (error) {
              reject(error);
            } else {
              db.query('SELECT * FROM airport WHERE airportID = ?', [airportID], (error, results) => {
                if (error) {
                  reject(error);
                }
                resolve(results[0]);
              });
            }
          }
        );
      });
    }
  },

  // Delete Airport Mutation
  deleteAirport: {
    type: AirportType,
    args: {
      airportID: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args, {userRoles}) {
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
      }
      return new Promise((resolve, reject) => {
        db.query('DELETE FROM airport WHERE airportID = ?', [args.airportID], (error) => {
          if (error) {
            reject(error);
          } else {
            resolve({ airportID: args.airportID });
          }
        });
      });
    }
  }
};

