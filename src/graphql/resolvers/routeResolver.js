// src/graphql/resolvers/routeResolver.js
import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql';
import db from '../../database.js'; // Adjust the path as needed
import RouteType from '../types/routeType.js'; // Adjust the path as needed

export const RouteQuery = {
  // Query to get a specific route
  route: {
    type: RouteType,
    args: { routeID: { type: GraphQLString } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM route WHERE routeID = ?', [args.routeID], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results[0]);
        });
      });
    }
  },
  // Query to get all routes
  allRoutes: {
    type: new GraphQLList(RouteType),
    resolve() {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM route', (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });
    }
  }
};

export const RouteMutation = {
  // Mutation to add a new route
  addRoute: {
    type: RouteType,
    args: {
      routeID: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('INSERT INTO route (routeID) VALUES (?)', [args.routeID], (error) => {
          if (error) {
            reject(error);
          } else {
            resolve({ routeID: args.routeID });
          }
        });
      });
    }
  },
  // Mutation to update a route
updateRoute: {
    type: RouteType, // Make sure you have RouteType defined
    args: {
      routeID: { type: new GraphQLNonNull(GraphQLString) },
      // Include other route fields here if needed
    },
    resolve(parent, args) {
      const { routeID, ...updateFields } = args;
  
      // Construct update query dynamically
      const updateQuery = Object.entries(updateFields)
        .map(([key, value]) => `${key} = ?`)
        .join(', ');
  
      return new Promise((resolve, reject) => {
        db.query(`UPDATE route SET ${updateQuery} WHERE routeID = ?`, 
                 [...Object.values(updateFields), routeID], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ routeID, ...updateFields });
          }
        });
      });
    }
  },
  
  // Mutation to delete a route
  deleteRoute: {
    type: RouteType,
    args: {
      routeID: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('DELETE FROM route WHERE routeID = ?', [args.routeID], (error) => {
          if (error) {
            reject(error);
          } else {
            resolve({ routeID: args.routeID });
          }
        });
      });
    }
  }
};

