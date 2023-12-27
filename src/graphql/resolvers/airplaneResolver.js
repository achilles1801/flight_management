// src/graphql/resolvers/airplaneResolver.js
import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLNonNull, GraphQLList } from 'graphql';
import db from '../../database.js'; // Adjust the path as needed
import AirplaneType from '../types/airplaneType.js'; // Adjust the path as needed

export const AirplaneQuery = {
  airplane: {
    type: AirplaneType,
    args: { tail_num: { type: GraphQLString } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM airplane WHERE tail_num = ?', [args.tail_num], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results[0]);
        });
      });
    }
  },
  airplanes: {
    type: new GraphQLList(AirplaneType),
    resolve() {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM airplane', (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });
    }
  }
};

export const AirplaneMutation = {
    addAirplane: {
        type: AirplaneType,
        args: {
          airlineID: { type: new GraphQLNonNull(GraphQLString) },
          tail_num: { type: new GraphQLNonNull(GraphQLString) },
          seat_capacity: { type: new GraphQLNonNull(GraphQLInt) },
          speed: { type: new GraphQLNonNull(GraphQLInt) },
          locationID: { type: GraphQLString },
          plane_type: { type: GraphQLString },
          skids: { type: GraphQLBoolean },
          propellers: { type: GraphQLInt },
          jet_engines: { type: GraphQLInt }
        },
        resolve(parent, args) {
          return new Promise((resolve, reject) => {
            db.query('INSERT INTO airplane (airlineID, tail_num, seat_capacity, speed, locationID, plane_type, skids, propellers, jet_engines) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                     [args.airlineID, args.tail_num, args.seat_capacity, args.speed, args.locationID, args.plane_type, args.skids, args.propellers, args.jet_engines], (error, results) => {
              if (error) {
                reject(error);
              } else {
                // Fetch and return the newly created airplane
                db.query('SELECT * FROM airplane WHERE tail_num = ?', [args.tail_num], (error, results) => {
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
      updateAirplane: {
        type: AirplaneType,
        args: {
          airlineID: { type: new GraphQLNonNull(GraphQLString) },
          tail_num: { type: new GraphQLNonNull(GraphQLString) },
          seat_capacity: { type: GraphQLInt },
          speed: { type: GraphQLInt },
          locationID: { type: GraphQLString },
          plane_type: { type: GraphQLString },
          skids: { type: GraphQLBoolean },
          propellers: { type: GraphQLInt },
          jet_engines: { type: GraphQLInt }
        },
        resolve(parent, args) {
          const { airlineID, tail_num, ...updatedFields } = args;
          const updateQuery = Object.entries(updatedFields)
            .map(([field, value]) => (value !== undefined ? `${field} = ?` : null))
            .filter(Boolean)
            .join(', ');
    
          if (!updateQuery) {
            throw new Error('No fields to update.');
          }
    
          const values = Object.values(updatedFields).filter((value) => value !== undefined);
    
          return new Promise((resolve, reject) => {
            db.query(`UPDATE airplane SET ${updateQuery} WHERE airlineID = ? AND tail_num = ?`, 
                     [...values, airlineID, tail_num], (error) => {
              if (error) {
                reject(error);
              } else {
                db.query('SELECT * FROM airplane WHERE airlineID = ? AND tail_num = ?', [airlineID, tail_num], (error, results) => {
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
    
      deleteAirplane: {
        type: AirplaneType,
        args: {
          airlineID: { type: new GraphQLNonNull(GraphQLString) },
          tail_num: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve(parent, args) {
          const { airlineID, tail_num } = args;
    
          return new Promise((resolve, reject) => {
            db.query('DELETE FROM airplane WHERE airlineID = ? AND tail_num = ?', [airlineID, tail_num], (error) => {
              if (error) {
                reject(error);
              } else {
                resolve({ airlineID, tail_num });
              }
            });
          });
        }
      },
  // Add mutations for update and delete
  // ...
};

