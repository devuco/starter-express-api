const {GraphQLObjectType, GraphQLString} = require("graphql");

const CompanyType = new GraphQLObjectType({
	name: "Company",
	fields: () => ({
		id: {type: GraphQLString},
		name: {type: GraphQLString},
		image: {type: GraphQLString},
	}),
});

module.exports = CompanyType;
