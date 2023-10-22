const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
	userId: {type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true},
	products: [{product: {type: mongoose.Schema.Types.ObjectId, ref: "Products"}, quantity: {type: Number, required: true, default: 0}, total: {type: Number, required: true}}],
	netTotal: {type: Number, required: true, default: 0},
});

const model = mongoose.model("Cart", cartSchema);

module.exports = model;
