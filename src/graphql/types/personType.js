import { GraphQLObjectType, GraphQLString } from 'graphql';

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    personID: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    locationID: { type: GraphQLString }
  })
});

export default PersonType;
