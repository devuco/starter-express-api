const {GraphQLObjectType, GraphQLString} = require("graphql");

const CategoryType = new GraphQLObjectType({
	name: "Categories",
	fields: () => ({
		id: {type: GraphQLString},
		name: {type: GraphQLString},
		image: {type: GraphQLString},
	}),
});

module.exports = CategoryType;
