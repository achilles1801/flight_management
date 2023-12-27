// src/graphql/resolvers/legResolver.js
import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } from 'graphql';
import db from '../../database.js'; // Adjust the path as needed
import LegType from '../types/legType.js'; // Adjust the path as needed

export const LegQuery = {
  // Query to get a specific leg
  leg: {
    type: LegType,
    args: { legID: { type: GraphQLString } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM leg WHERE legID = ?', [args.legID], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results[0]);
        });
      });
    }
  },
  // Query to get all legs
  allLegs: {
    type: new GraphQLList(LegType),
    resolve() {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM leg', (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });
    }
  }
};

export const LegMutation = {
  // Mutation to add a new leg
  addLeg: {
    type: LegType,
    args: {
      legID: { type: new GraphQLNonNull(GraphQLString) },
      distance: { type: new GraphQLNonNull(GraphQLInt) },
      departure: { type: new GraphQLNonNull(GraphQLString) },
      arrival: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args, {userRoles}) {
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
      }
      return new Promise((resolve, reject) => {
        const { legID, distance, departure, arrival } = args;
        db.query('INSERT INTO leg (legID, distance, departure, arrival) VALUES (?, ?, ?, ?)',
                 [legID, distance, departure, arrival], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ legID, distance, departure, arrival });
          }
        });
      });
    }
  },
  // Mutation to update a leg
    updateLeg: {
        type: LegType,
        args: {
        legID: { type: new GraphQLNonNull(GraphQLString) },
        distance: { type: GraphQLInt },
        departure: { type: GraphQLString },
        arrival: { type: GraphQLString }
        },
        resolve(parent, args, {userRoles}) {
          if (!userRoles.includes('Admin') || userRoles.length === 0) {
            throw new Error('You are not authorized to do this action');
          }
        const { legID, distance, departure, arrival } = args;
        const updateFields = {};
        if (distance !== undefined) updateFields.distance = distance;
        if (departure !== undefined) updateFields.departure = departure;
        if (arrival !== undefined) updateFields.arrival = arrival;
    
        const updateQuery = Object.entries(updateFields)
            .map(([key, value]) => `${key} = ?`)
            .join(', ');
    
        return new Promise((resolve, reject) => {
            db.query(`UPDATE leg SET ${updateQuery} WHERE legID = ?`, 
                    [...Object.values(updateFields), legID], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve({ legID, ...updateFields });
            }
            });
        });
        }
    },
  
  // Mutation to delete a leg
  deleteLeg: {
    type: LegType,
    args: {
      legID: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args, {userRoles}) {
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
      }
      return new Promise((resolve, reject) => {
        db.query('DELETE FROM leg WHERE legID = ?', [args.legID], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ legID: args.legID });
          }
        });
      });
    }
  }
};

