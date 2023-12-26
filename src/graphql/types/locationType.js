import { GraphQLObjectType, GraphQLString } from 'graphql';

const LocationType = new GraphQLObjectType({
  name: 'Location',
  fields: () => ({
    locationID: { type: GraphQLString }
    // Add other fields as needed
  })
});

export default LocationType;
