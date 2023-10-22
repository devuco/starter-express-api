const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList} = require("graphql");

const Cart = require("../../models/Cart");
const Products = require("../../models/Products");
const cartType = require("../models/cartQL");
const ProductType = require("../models/productQL");

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		cart: {
			type: cartType,
			args: {userId: {type: GraphQLString}},
			resolve: (_parent, args) => Cart.findOne({userId: args.userId}),
		},
		products: {
			type: new GraphQLList(ProductType),
			resolve: () => Products.find(),
		},
	},
});

module.exports = new GraphQLSchema({query: RootQuery});
