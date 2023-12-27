// src/graphql/resolvers/personResolver.js
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import db from '../../database.js'; // Adjust the path as needed
import PersonType from '../types/personType.js'; // Adjust the path as needed

export const PersonQuery = {
  // Get a single person by ID
  person: {
    type: PersonType,
    args: { personID: { type: GraphQLString } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM person WHERE personID = ?', [args.personID], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results[0] || null);
        });
      });
    }
  },
  // Get all persons
  persons: {
    type: new GraphQLList(PersonType),
    resolve() {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM person', (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });
    }
  }
};

export const PersonMutation = {
  // Add Person Mutation
  addPerson: {
    type: PersonType,
    args: {
      personID: { type: new GraphQLNonNull(GraphQLString) },
      first_name: { type: new GraphQLNonNull(GraphQLString) },
      last_name: { type: GraphQLString },
      locationID: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('INSERT INTO person (personID, first_name, last_name, locationID) VALUES (?, ?, ?, ?)',
          [args.personID, args.first_name, args.last_name, args.locationID], 
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

  // Update Person Mutation
  updatePerson: {
    type: PersonType,
    args: {
      personID: { type: new GraphQLNonNull(GraphQLString) },
      first_name: { type: GraphQLString },
      last_name: { type: GraphQLString },
      locationID: { type: GraphQLString }
    },
    resolve(parent, args) {
      const { personID, ...updateValues } = args;
      const fields = Object.keys(updateValues).filter(key => updateValues[key] != null);
      const values = fields.map(key => updateValues[key]);

      return new Promise((resolve, reject) => {
        db.query(`UPDATE person SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE personID = ?`,
          [...values, personID], (error) => {
            if (error) {
              reject(error);
            } else {
              db.query('SELECT * FROM person WHERE personID = ?', [personID], (error, results) => {
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

  // Delete Person Mutation
  deletePerson: {
    type: PersonType,
    args: {
      personID: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('DELETE FROM person WHERE personID = ?', [args.personID], (error) => {
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

