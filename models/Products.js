const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
	oneStar: {type: Number, default: 0},
	twoStar: {type: Number, default: 0},
	threeStar: {type: Number, default: 0},
	fourStar: {type: Number, default: 0},
	fiveStar: {type: Number, default: 0},
});
const ProductSchema = new mongoose.Schema({
	image: {type: String, required: true},
	name: {type: String, required: true},
	category: {type: mongoose.Schema.Types.ObjectId, ref: "Categories", required: true},
	description: {type: String, required: true},
	price: {type: Number, required: true},
	stock: {type: Number, required: true},
	company: {type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true},
	discount: {type: Number, required: false, default: 0},
	discountedPrice: {type: Number, required: false, default: 0},
	rating: {type: RatingSchema, required: false, default: {}},
	avgRating: {type: Number, required: false, default: 0},
	totalRatings: {type: Number, required: false, default: 0},
	review: {type: String, required: false, default: 0},
	color: {type: String, required: true},
});

const model = mongoose.model("Products", ProductSchema);
module.exports = model;
