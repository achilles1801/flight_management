// src/graphql/resolvers/locationResolver.js
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import db from '../../database.js'; // Adjust the path as needed
import LocationType from '../types/locationType.js'; // Adjust the path as needed

export const LocationQuery = {
  // Get a single location by ID
  location: {
    type: LocationType,
    args: { locationID: { type: GraphQLString } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM location WHERE locationID = ?', [args.locationID], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results[0] || null);
        });
      });
    }
  },
  // Get all locations
  locations: {
    type: new GraphQLList(LocationType),
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM location', (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });
    }
  }
};

export const LocationMutation = {
    addLocation: {
        type: LocationType,
        args: {
          locationID: { type: new GraphQLNonNull(GraphQLString) }
          // Include other fields if necessary
        },
        resolve(parent, args, {userRoles}) {
          if (!userRoles.includes('Admin') || userRoles.length === 0) {
            throw new Error('You are not authorized to do this action');
          }
          return new Promise((resolve, reject) => {
            db.query('INSERT INTO location (locationID) VALUES (?)', 
                     [args.locationID], (error, results) => {
              if (error) {
                reject(error);
              } else {
                // Query the newly created location
                db.query('SELECT * FROM location WHERE locationID = ?', [args.locationID], (error, results) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve(results[0]);
                  }
                });
              }
            });
          });
        }
      },

  // Update Location Mutation
  updateLocation: {
    type: LocationType,
    args: {
      locationID: { type: new GraphQLNonNull(GraphQLString) }
      // Add other arguments if needed
    },
    resolve(parent, args, {userRoles}) {
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
      }
      const { locationID, ...updateValues } = args;
      // Prepare query for dynamic update
      const fields = Object.keys(updateValues).filter(key => updateValues[key] != null);
      const values = fields.map(key => updateValues[key]);

      return new Promise((resolve, reject) => {
        db.query(`UPDATE location SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE locationID = ?`, 
                 [...values, locationID], (error) => {
          if (error) {
            reject(error);
          } else {
            db.query('SELECT * FROM location WHERE locationID = ?', [locationID], (error, results) => {
              if (error) {
                reject(error);
              }
              resolve(results[0]);
            });
          }
        });
      });
    }
  },

  // Delete Location Mutation
  deleteLocation: {
    type: LocationType,
    args: {
      locationID: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args, {userRoles}) {
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
      }
      return new Promise((resolve, reject) => {
        db.query('DELETE FROM location WHERE locationID = ?', [args.locationID], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ locationID: args.locationID });
          }
        });
      });
    }
  }
};

