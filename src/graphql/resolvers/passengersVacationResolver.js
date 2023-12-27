// src/graphql/resolvers/passengersVacationsResolver.js
import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } from 'graphql';
import db from '../../database.js'; // Adjust the path as needed
import passengersVacationsType from '../types/passengersVacationsType.js'; // Adjust the path as needed

export const PassengersVacationsQuery = {
  // Get vacation details for a single passenger
  passengersVacations: {
    type: new GraphQLList(passengersVacationsType),
    args: { personID: { type: GraphQLString } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM passenger_vacations WHERE personID = ?', [args.personID], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });
    }
  },
  // Get all passenger vacation details
  allpassengersVacationss: {
    type: new GraphQLList(passengersVacationsType),
    resolve() {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM passenger_vacations', (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });
    }
  }
};

export const PassengersVacationsMutation = {
  // Add vacation details for a passenger
  addpassengersVacations: {
    type: passengersVacationsType,
    args: {
      personID: { type: new GraphQLNonNull(GraphQLString) },
      airportID: { type: new GraphQLNonNull(GraphQLString) },
      sequence: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('INSERT INTO passenger_vacations (personID, airportID, sequence) VALUES (?, ?, ?)',
          [args.personID, args.airportID, args.sequence], 
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

  // Update vacation details for a passenger
  updatepassengersVacations: {
    type: passengersVacationsType,
    args: {
      personID: { type: new GraphQLNonNull(GraphQLString) },
      airportID: { type: GraphQLString },
      sequence: { type: GraphQLInt }
    },
    resolve(parent, args) {
      const { personID, ...updateValues } = args;
      const fields = Object.keys(updateValues).filter(key => updateValues[key] != null);
      const values = fields.map(key => updateValues[key]);

      return new Promise((resolve, reject) => {
        db.query(`UPDATE passenger_vacations SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE personID = ?`,
          [...values, personID], (error) => {
            if (error) {
              reject(error);
            } else {
              db.query('SELECT * FROM passenger_vacations WHERE personID = ?', [personID], (error, results) => {
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

  // Delete vacation details for a passenger
  deletepassengersVacations: {
    type: passengersVacationsType,
    args: {
      personID: { type: new GraphQLNonNull(GraphQLString) },
      sequence: { type: GraphQLInt }
    },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('DELETE FROM passenger_vacations WHERE personID = ? AND sequence = ?', [args.personID, args.sequence], (error) => {
          if (error) {
            reject(error);
          } else {
            resolve({ personID: args.personID, sequence: args.sequence });
          }
        });
      });
    }
  }
};

