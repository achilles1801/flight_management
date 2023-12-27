// src/graphql/resolvers/pilotLicensesResolver.js
import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql';
import db from '../../database.js'; // Adjust the path as needed
import PilotLicenseType from '../types/pilotLicensesType.js'; // Adjust the path as needed

export const PilotLicenseQuery = {
  // Query to get licenses for a specific pilot
  pilotLicenses: {
    type: new GraphQLList(PilotLicenseType),
    args: { personID: { type: GraphQLString } },
    resolve(parent, args) {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM pilot_licenses WHERE personID = ?', [args.personID], (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });
    }
  },
  // Query to get all pilot licenses
  allPilotLicenses: {
    type: new GraphQLList(PilotLicenseType),
    resolve() {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM pilot_licenses', (error, results) => {
          if (error) {
            reject(error);
          }
          resolve(results);
        });
      });
    }
  }
};

export const PilotLicenseMutation = {
  // Mutation to add a pilot license
  addPilotLicense: {
    type: PilotLicenseType,
    args: {
      personID: { type: new GraphQLNonNull(GraphQLString) },
      license: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args, {userRoles}) {
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
      }
      return new Promise((resolve, reject) => {
        db.query('INSERT INTO pilot_licenses (personID, license) VALUES (?, ?)', [args.personID, args.license], (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(args);
          }
        });
      });
    }
  },
  // Mutation to update pilot licenses
updatePilotLicense: {
    type: PilotLicenseType, // Ensure you have PilotLicensesType defined
    args: {
      personID: { type: new GraphQLNonNull(GraphQLString) },
      license: { type: new GraphQLNonNull(GraphQLString) }
      // Add other fields as needed
    },
    resolve(parent, args, {userRoles}) {
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
      }
      const { personID, license, ...updateFields } = args;
  
      const updateQuery = Object.entries(updateFields)
        .map(([key, value]) => `${key} = ?`)
        .join(', ');
  
      return new Promise((resolve, reject) => {
        db.query(`UPDATE pilot_licenses SET ${updateQuery} WHERE personID = ? AND license = ?`, 
                 [...Object.values(updateFields), personID, license], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ personID, license, ...updateFields });
          }
        });
      });
    }
  },
  
  // Mutation to delete a pilot license
  deletePilotLicense: {
    type: PilotLicenseType,
    args: {
      personID: { type: new GraphQLNonNull(GraphQLString) },
      license: { type: GraphQLString }
    },
    resolve(parent, args, {userRoles}) {
      if (!userRoles.includes('Admin') || userRoles.length === 0) {
        throw new Error('You are not authorized to do this action');
      }
      return new Promise((resolve, reject) => {
        db.query('DELETE FROM pilot_licenses WHERE personID = ? AND license = ?', [args.personID, args.license], (error) => {
          if (error) {
            reject(error);
          } else {
            resolve({ personID: args.personID, license: args.license });
          }
        });
      });
    }
  }
};

