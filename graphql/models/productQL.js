const {GraphQLObjectType, GraphQLString, GraphQLInt} = require("graphql");
const CategoryType = require("./cateogryQL");
const CompanyType = require("./companyQL");
const Categories = require("../../models/Categories");
const Companies = require("../../models/Company");

const ProductType = new GraphQLObjectType({
	name: "Products",
	fields: () => ({
		id: {type: GraphQLString},
		image: {type: GraphQLString},
		name: {type: GraphQLString},
		description: {type: GraphQLString},
		price: {type: GraphQLInt},
		stock: {type: GraphQLInt},
		discount: {type: GraphQLInt},
		discountedPrice: {type: GraphQLInt},
		avgRating: {type: GraphQLInt},
		totalRatings: {type: GraphQLInt},
		review: {type: GraphQLString},
		color: {type: GraphQLString},
		category: {type: CategoryType, resolve: async (parent) => await Categories.findById(parent.category)},
		company: {type: CompanyType, resolve: async (parent) => await Companies.findById(parent.company)},
	}),
});

module.exports = ProductType;
