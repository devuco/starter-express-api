const express = require("express");
const User = require("../models/Users");
const Razorpay = require("razorpay");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const moment = require("moment");

const router = express.Router();

//TODO Validation for address body
router.put("/address", async (req, res) => {
	const body = req.body;
	const {userId} = req;
	if (body) {
		{
			if (!body.houseNo || !body.street || !body.city || !body.state || !body.pincode) {
				res.status(400).json({success: false, message: "Please fill all the fields"});
			} else {
				try {
					const user = await User.findByIdAndUpdate(userId, {$push: {address: req.body}}, {new: true});
					const address = await user.address;
					res.json({success: true, data: address});
				} catch (error) {
					res.status(400).json({message: error.message, success: false});
				}
			}
		}
	} else {
		res.status(400).json({success: false, message: "Address is required"});
	}
});

router.get("/address", async (req, res) => {
	const {userId} = req;
	try {
		const user = await User.findById(userId);
		const address = await user.address;
		if (address) {
			res.json({success: true, data: address});
		} else {
			res.status(200).json({message: "Address not found", success: false, data: {}});
		}
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});

router.post("/order/create", async (req, res) => {
	const amount = req.body.amount;

	try {
		var instance = new Razorpay({key_id: "rzp_test_GfxJZDSYJvQ0Gf", key_secret: "3d49EZUzRb1oH1Hli8USYKzF"});

		const order = await instance.orders.create({
			amount: amount * 100,
			currency: "INR",
		});
		res.json({success: true, data: order});
	} catch (error) {
		res.status(400).json({message: error, success: false});
	}
});

router.post("/order/place", async (req, res) => {
	try {
		const {body, userId} = req;
		const userCart = await Cart.findOne({userId});
		const products = userCart.products;
		const order = new Order({
			userId,
			orderId: body.orderId,
			orderDate: new Date(),
			netTotal: body.amount,
			products,
		});
		await order.save();
		await Cart.findOneAndDelete({userId});
		res.json({success: true, message: "Order Placed Successfully"});
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});

router.get("/order/:orderId/invoice", async (req, res) => {
	const {userId} = req;
	try {
		Order.findOne({orderId: req.params.orderId, userId})
			.populate("products.product", "image name price color discountedPrice discount")
			.exec((err, data) => {
				if (err) {
					res.status(400).json({success: false, message: err});
				} else {
					User.findById(userId, (err, user) => {
						if (err) {
							res.status(400).json({success: false, message: err});
						} else {
							let orderDate = moment(data.orderDate).format("DD-MM-YYYY");
							res.render("../views/invoice.ejs", {data, user, orderDate});
						}
					});
				}
			});
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});

module.exports = router;
