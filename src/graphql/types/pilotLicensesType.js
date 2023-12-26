import { GraphQLObjectType, GraphQLString } from 'graphql';

const PilotLicensesType = new GraphQLObjectType({
  name: 'PilotLicenses',
  fields: () => ({
    personID: { type: GraphQLString },
    license: { type: GraphQLString }
  })
});

export default PilotLicensesType;
