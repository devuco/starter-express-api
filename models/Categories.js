const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
	name: {type: String, required: true, unique: true},
	image: {type: String, required: true},
});

const model = mongoose.model("Categories", CategorySchema);
module.exports = model;
