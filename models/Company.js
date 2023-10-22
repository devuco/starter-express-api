const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
	name: {type: String, required: true},
	image: {type: String, required: true},
});
const model = mongoose.model("Company", CompanySchema);
module.exports = model;
