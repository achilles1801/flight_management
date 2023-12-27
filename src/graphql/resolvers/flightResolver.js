import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLID } from 'graphql';
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
  flights: {
    type: new GraphQLList(FlightType),
    resolve() {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM flight', (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    },
  },
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
        resolve(parent, args, {userRoles}) {
          if (!userRoles.includes('Admin') || userRoles.length === 0) {
            throw new Error('You are not authorized to do this action');
          }
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
  
    updateFlight: {
      type: FlightType,
      args: {
        flightID: { type: new GraphQLNonNull(GraphQLString) },
        routeID: { type: GraphQLString },
        support_airline: { type: GraphQLString },
        support_tail: { type: GraphQLString },
        progress: { type: GraphQLInt },
        airplane_status: { type: GraphQLString },
        next_time: { type: GraphQLString },
        cost: { type: GraphQLInt },
      },
      resolve(parent, args, {userRoles}) {
        if (!userRoles.includes('Admin') || userRoles.length === 0) {
          throw new Error('You are not authorized to do this action');
        }
        const { flightID, ...updatedFields } = args;
        const updateQuery = Object.entries(updatedFields)
          .map(([field, value]) => (value !== undefined ? `${field} = ?` : null))
          .filter(Boolean)
          .join(', ');
  
        if (!updateQuery) {
          throw new Error('No fields to update.');
        }
  
        const values = Object.values(updatedFields).filter((value) => value !== undefined);
  
        return new Promise((resolve, reject) => {
          db.query(`UPDATE flight SET ${updateQuery} WHERE flightID = ?`, [...values, flightID], (err, result) => {
            if (err) {
              reject(err);
            } else {
              db.query('SELECT * FROM flight WHERE flightID = ?', [flightID], (err, results) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(results[0]);
                }
              });
            }
          });
        });
      },
    },
  
    deleteFlight: {
      type: FlightType,
      args: {
        flightID: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args, {userRoles}) {
        if (!userRoles.includes('Admin') || userRoles.length === 0) {
          throw new Error('You are not authorized to do this action');
        }
        const { flightID } = args;
  
        return new Promise((resolve, reject) => {
          db.query('SELECT * FROM flight WHERE flightID = ?', [flightID], (err, results) => {
            if (err) {
              reject(err);
            } else {
              const flightToDelete = results[0];
              db.query('DELETE FROM flight WHERE flightID = ?', [flightID], (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(flightToDelete);
                }
              });
            }
          });
        });
      },
    },
  };
  
// Export the resolvers
export default {
  FlightQuery,
  FlightMutation
};
