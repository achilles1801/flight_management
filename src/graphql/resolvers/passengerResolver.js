// src/graphql/resolvers/passengerResolver.js
import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } from 'graphql';
import db from '../../database.js'; // Adjust the path as needed
import PassengerType from '../types/passengerType.js'; // Adjust the path as needed

export const PassengerQuery = {
  // Get a single passenger by ID
  passenger: {
    type: PassengerType,
    args: { personID: { type: GraphQLString } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM passenger WHERE personID = ?', [args.personID], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results[0] || null);
        });
      });
    }
  },
  // Get all passengers
  passengers: {
    type: new GraphQLList(PassengerType),
    resolve() {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM passenger', (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });
    }
  }
};

export const PassengerMutation = {
  // Add Passenger Mutation
  addPassenger: {
    type: PassengerType,
    args: {
      personID: { type: new GraphQLNonNull(GraphQLString) },
      miles: { type: GraphQLInt },
      funds: { type: GraphQLInt }
    },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('INSERT INTO passenger (personID, miles, funds) VALUES (?, ?, ?)',
          [args.personID, args.miles, args.funds], 
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

  // Update Passenger Mutation
  updatePassenger: {
    type: PassengerType,
    args: {
      personID: { type: new GraphQLNonNull(GraphQLString) },
      miles: { type: GraphQLInt },
      funds: { type: GraphQLInt }
    },
    resolve(parent, args) {
      const { personID, ...updateValues } = args;
      const fields = Object.keys(updateValues).filter(key => updateValues[key] != null);
      const values = fields.map(key => updateValues[key]);

      return new Promise((resolve, reject) => {
        db.query(`UPDATE passenger SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE personID = ?`,
          [...values, personID], (error) => {
            if (error) {
              reject(error);
            } else {
              db.query('SELECT * FROM passenger WHERE personID = ?', [personID], (error, results) => {
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

  // Delete Passenger Mutation
  deletePassenger: {
    type: PassengerType,
    args: {
      personID: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('DELETE FROM passenger WHERE personID = ?', [args.personID], (error) => {
          if (error) {
            reject(error);
          } else {
            resolve({ personID: args.personID });
          }
        });
      });
    }
  }
};

