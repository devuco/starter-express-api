const express = require("express");
const multer = require("multer");
const Products = require("../models/Products");
const Categories = require("../models/Categories");
const Companies = require("../models/Company");
const Wishlist = require("../models/Wishlist");
const getImageColors = require("get-image-colors");
const path = require("path");

const storage = multer.diskStorage({
	destination: (_req, _file, callback) => {
		callback(null, "./public/uploads/images/products");
	},
	filename: (_req, file, callback) => {
		callback(null, Date.now() + file.originalname);
	},
});

const upload = multer({
	storage: storage,
});

const router = express.Router();

router.get("/", async (req, res) => {
	const {userId} = req;
	const {company, category, page} = req.query;
	try {
		let filter = {};
		if (company) {
			filter.company = company;
		} else if (category) {
			filter.category = category;
		}
		const products = await Products.find(filter, "name price _id image discount discountedPrice color")
			.sort()
			.skip(page * 10)
			.limit(10)
			.exec();
		const wishlist = await Wishlist.findOne({userId});
		const newArray = [];
		if (wishlist) {
			products.forEach((p) => {
				const product = p.toObject();
				const id = wishlist.products.find((item) => item.toString() === product._id.toString());
				if (id) {
					product.isSaved = true;
				} else {
					product.isSaved = false;
				}
				newArray.push(product);
			});
			res.json({success: true, data: newArray});
		} else {
			res.json({success: true, data: products});
		}
	} catch (errors) {
		res.send(errors);
	}
});

router.post("/", upload.single("image"), async (req, res) => {
	if (req.isAdmin) {
		try {
			const imagePath = path.join(__dirname, "..", "public", "uploads", "images", "products", req.file.filename);
			const colorsArray = await getImageColors(imagePath, {count: 3});
			const colors = colorsArray.map((el) => el.hex());
			console.log(colors);
			const discountedPrice = req.body.price - (req.body.price * req.body.discount) / 100;
			const product = new Products({...req.body, image: "products/" + req.file.filename, discountedPrice});
			const response = await product.save();
			res.json(response);
		} catch (error) {
			res.status(400).json({message: error.message, success: false});
		}
	} else {
		res.status(401).json({message: "You are not authorized to perform this action", success: false});
	}
});

router.get("/:id", async (req, res) => {
	try {
		const {id} = req.params;
		const {userId} = req;

		const p = await Products.findById(id);
		const wishlist = await Wishlist.findOne({userId});
		if (wishlist) {
			const product = p.toObject();
			const id = wishlist.products.find((item) => item.toString() === product._id.toString());
			if (id) {
				product.isSaved = true;
			} else {
				product.isSaved = false;
			}
			res.json({success: true, data: product});
		} else {
			res.json({success: true, data: p});
		}
	} catch (error) {
		res.status(400).send({success: false, message: error.message});
	}
});

router.put("/rate/:id", async (req, res) => {
	try {
		const obj = await Products.findById(req.params.id);
		const {rating} = req.body;
		if (rating && rating <= 5 && rating >= 1) {
			let stars = obj.rating;
			switch (rating) {
				case 1:
					stars.oneStar = (stars.oneStar || 0) + 1;
					break;
				case 2:
					stars.twoStar = (stars.twoStar || 0) + 1;
					break;
				case 3:
					stars.threeStar = (stars.threeStar || 0) + 1;
					break;
				case 4:
					stars.fourStar = (stars.fourStar || 0) + 1;
					break;
				case 5:
					stars.fiveStar = (stars.fiveStar || 0) + 1;
					break;
			}

			let avgRating =
				(stars.oneStar * 1 + stars.twoStar * 2 + stars.threeStar * 3 + stars.fourStar * 4 + stars.fiveStar * 5) / (stars.oneStar + stars.twoStar + stars.threeStar + stars.fourStar + stars.fiveStar);
			let totalRatings = stars.oneStar + stars.twoStar + stars.threeStar + stars.fourStar + stars.fiveStar;
			Products.findByIdAndUpdate(req.params.id, {rating: stars, avgRating, totalRatings})
				.then(() => {
					res.send({message: "Updated Successfully", success: true});
				})
				.catch(() => {
					res.status(400).json({message: error.message, success: false});
				});
		} else {
			res.status(400).json({message: "Rating should be between 1-5", success: false});
		}
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});

router.get("/search/:input", async (req, res) => {
	const {input} = req.params;
	try {
		const products = await Products.find({name: {$regex: input, $options: "i"}}, "name image _id").limit(4);
		const categories = await Categories.find({name: {$regex: input, $options: "i"}}, "name image _id").limit(4);
		const companies = await Companies.find({name: {$regex: input, $options: "i"}}, "name image _id").limit(4);
		let response = {products, categories, companies};
		res.json(response);
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});

module.exports = router;
