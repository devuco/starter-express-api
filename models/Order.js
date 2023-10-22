const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const OrderSchema = new mongoose.Schema({
	orderId: {type: String, required: true, unique: true},
	userId: {type: String, required: true},
	orderDate: {type: Date, required: true},
	products: [{product: {type: mongoose.Schema.Types.ObjectId, ref: "Products"}, quantity: {type: Number, required: true, default: 0}, total: {type: Number, required: true}}],
	netTotal: {type: Number, required: true, default: 0},
	status: {type: String, required: true, default: "Pending Dispatch"},
	// deliveryAddress: {type: mongoose.Schema.Types.ObjectId, ref: "Products.Address", required: true},
});

OrderSchema.plugin(uniqueValidator, {message: "Order Id already exists"});
const model = mongoose.model("Order", OrderSchema);

module.exports = model;
