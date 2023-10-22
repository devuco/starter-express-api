const {GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList} = require("graphql");

const ProductType = require("./productQL");
const Products = require("../../models/Products");

const cartProductsType = new GraphQLObjectType({
	name: "type",
	fields: () => ({
		quantity: {type: GraphQLInt},
		total: {type: GraphQLInt},
		product: {
			type: ProductType,
			resolve: async (parent) => await Products.findById(parent.product),
		},
	}),
});

const cartType = new GraphQLObjectType({
	name: "Cart",
	fields: () => ({
		userId: {type: GraphQLString},
		products: {type: new GraphQLList(cartProductsType)},
		netTotal: {type: GraphQLInt},
	}),
});

module.exports = cartType;
