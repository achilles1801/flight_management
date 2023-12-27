import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList } from 'graphql';
import db from '../../database.js'; // Adjust the path to your database connection file
import RoutePathType from '../types/routePathType.js'; // Ensure you have a RoutePathType defined

export const RoutePathQuery = {
  routePath: {
    type: RoutePathType,
    args: { routeID: { type: GraphQLString }, sequence: { type: GraphQLInt } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM route_path WHERE routeID = ? AND sequence = ?', 
                 [args.routeID, args.sequence], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results[0]);
        });
      });
    },
  },
  routePaths: {
    type: new GraphQLList(RoutePathType),
    resolve() {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM route_path', (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });
    },
  },
};

export const RoutePathMutation = {
  addRoutePath: {
    type: RoutePathType,
    args: {
      routeID: { type: new GraphQLNonNull(GraphQLString) },
      legID: { type: new GraphQLNonNull(GraphQLString) },
      sequence: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve(parent, args, {userRoles}) {
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
      }
      return new Promise((resolve, reject) => {
        db.query('INSERT INTO route_path (routeID, legID, sequence) VALUES (?, ?, ?)', 
                 [args.routeID, args.legID, args.sequence], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve({ routeID: args.routeID, legID: args.legID, sequence: args.sequence });
        });
      });
    },
  },
  updateRoutePath: {
    type: RoutePathType,
    args: {
      routeID: { type: new GraphQLNonNull(GraphQLString) },
      sequence: { type: new GraphQLNonNull(GraphQLInt) },
      legID: { type: GraphQLString },
      newSequence: { type: GraphQLInt },
    },
    resolve(parent, args, {userRoles}) {
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
      }
      return new Promise((resolve, reject) => {
        db.query('UPDATE route_path SET legID = ?, sequence = ? WHERE routeID = ? AND sequence = ?', 
                 [args.legID, args.newSequence, args.routeID, args.sequence], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve({ routeID: args.routeID, legID: args.legID, sequence: args.newSequence });
        });
      });
    },
  },
  deleteRoutePath: {
    type: RoutePathType,
    args: {
      routeID: { type: new GraphQLNonNull(GraphQLString) },
      sequence: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve(parent, args, {userRoles}) {
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
      }
      return new Promise((resolve, reject) => {
        db.query('DELETE FROM route_path WHERE routeID = ? AND sequence = ?', 
                 [args.routeID, args.sequence], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve({ routeID: args.routeID, sequence: args.sequence });
        });
      });
    },
  },
};

