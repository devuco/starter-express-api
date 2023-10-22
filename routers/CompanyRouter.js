const express = require("express");
const Company = require("../models/Company");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "./public/uploads/images/company");
	},
	filename: (req, file, callback) => {
		callback(null, Date.now() + file.originalname);
	},
});

const upload = multer({
	storage: storage,
});

router.post("/", upload.single("image"), async (req, res) => {
	if (req.isAdmin) {
		try {
			const company = new Company({...req.body, image: "company/" + req.file.filename});
			const response = await company.save();
			res.json({sucess: true, data: response});
		} catch (error) {
			res.status(400).json({message: error.message, success: false});
		}
	} else {
		res.status(401).json({message: "You are not authorized to perform this action", success: false});
	}
});

router.get("/", async (req, res) => {
	const {page} = req.query;
	try {
		let companies = [];
		if (page) {
			companies = await Company.find()
				.sort()
				.skip(page * 8)
				.limit(8)
				.exec();
		} else {
			companies = await Company.find();
		}
		res.json({sucess: true, data: companies});
	} catch (error) {
		res.status(400).send({message: error.message, success: false});
	}
});

module.exports = router;
