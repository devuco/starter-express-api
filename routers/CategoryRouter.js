const express = require("express");
const multer = require("multer");
const Categories = require("../models/Categories");

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "./public/uploads/images/categories");
	},
	filename: (req, file, callback) => {
		callback(null, Date.now() + file.originalname);
	},
});

const upload = multer({
	storage: storage,
});

const router = express.Router();

router.get("/", async (req, res) => {
	const {page} = req.query;
	try {
		let categories = [];
		if (page) {
			categories = await Categories.find()
				.sort()
				.skip(page * 2)
				.limit(2)
				.exec();
		} else {
			categories = await Categories.find();
		}
		res.json({sucess: true, data: categories});
	} catch (error) {
		res.status(400).send({message: error.message, success: false});
	}
});

router.get("/names", async (_req, res) => {
	try {
		const categories = await Categories.find({}, "name -_id");
		const names = categories.map((el) => el.name);
		res.json({sucess: true, data: names});
	} catch (error) {
		res.send(error);
	}
});

router.post("/", upload.single("image"), async (req, res) => {
	if (req.isAdmin) {
		try {
			const category = new Categories({...req.body, image: "categories/" + req.file.filename});
			const response = await category.save();
			res.json({success: true, data: response});
		} catch (error) {
			res.status(400).json({message: error.message, success: false});
		}
	} else {
		res.status(401).json({message: "You are not authorized to perform this action", success: false});
	}
});

module.exports = router;
