const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Products");

const router = express.Router();

router.post("/", async (req, res) => {
	const {body, userId} = req;
	const {product: productId} = body;
	try {
		const discountedPrice = (await Product.findOne({_id: productId})).discountedPrice;
		const userCart = await Cart.findOne({userId});
		let quantity = 1;
		let total = discountedPrice * quantity;

		//check if cart exists
		if (userCart) {
			const products = userCart.products;
			const cartId = userCart._id;

			const productIndex = products.findIndex((el) => productId === el.product.toString());
			//check if product is already in cart
			if (productIndex > -1) {
				quantity = products[productIndex].quantity;
				let product = products[productIndex].toObject();
				let prevTotal = product.total;
				quantity = quantity + 1;
				total = discountedPrice * quantity;
				product = {...product, quantity, total};
				products[productIndex] = product;
				const response = await Cart.findByIdAndUpdate(cartId, {products, netTotal: userCart.netTotal - prevTotal + total}, {new: true});
				res.json({success: false, data: response});

				//push product to cart
			} else {
				products.push({product: productId, quantity, total});
				const response = await Cart.findByIdAndUpdate(cartId, {products, netTotal: userCart.netTotal + total}, {new: true});
				res.json({success: true, data: response});
			}

			//else create cart
		} else {
			let productBody = {
				product: productId,
				quantity: quantity,
				total,
			};
			const cart = new Cart({userId, products: [productBody], netTotal: total});
			await cart.save();
			res.json({success: true, message: "Updated SuccessFully"});
		}
	} catch (error) {
		res.status(400).json({success: false, message: error.message});
	}
});

router.get("/", async (req, res) => {
	const {userId} = req;
	try {
		Cart.findOne({userId})
			.populate("products.product", "image name price color discountedPrice discount")
			.exec((err, data) => {
				if (err) {
					res.status(400).json({success: false, message: err});
				}
				let netTotal = 0;
				data?.products?.map((el) => {
					el.total = el.quantity * el.product.discountedPrice;
					netTotal += el.total;
				});
				if (data) data.netTotal = netTotal;
				res.json({success: true, data: data ?? []});
			});
	} catch (error) {
		res.status(400).json({success: false, message: error.message});
	}
});

router.put("/", async (req, res) => {
	const {product: productId, action} = req.body;
	const {userId} = req;
	try {
		const discountedPrice = (await Product.findOne({_id: productId})).discountedPrice;
		const userCart = await Cart.findOne({userId});
		const products = userCart.products;
		const cartId = userCart._id;

		if (!userCart) {
			res.status(400).json({success: false, message: "Cart not found"});
		}

		const productIndex = products.findIndex((el) => productId === el.product.toString());
		//check if product is already in cart
		if (productIndex > -1) {
			let product = products[productIndex].toObject();
			product.quantity = action === 1 ? product.quantity + 1 : product.quantity - 1;
			let prevTotal = product.total;
			product.total = discountedPrice * product.quantity;
			let netTotal = userCart.netTotal - prevTotal + product.total;

			if (product.quantity === 0) {
				const data = await Cart.findOneAndUpdate({userId}, {$pull: {products: {product: productId}}, netTotal}, {new: true}).populate(
					"products.product",
					"image name price color discountedPrice discount"
				);
				res.json({success: true, data});
			} else {
				products[productIndex] = product;
				const data = await Cart.findByIdAndUpdate(cartId, {products, netTotal}, {new: true}).populate("products.product", "image name price color discountedPrice discount");
				res.json({success: true, data});
			}
		} else {
			res.status(400).json({success: false, message: "Product is not in cart"});
		}
	} catch (error) {
		res.status(400).json({success: false, message: error.message});
	}
});

router.delete("/:id", async (req, res) => {
	const {userId} = req;
	try {
		const cart = Cart.findOne({userId});
		if (cart) {
			const data = await Cart.findOneAndUpdate({userId}, {$pull: {products: {product: req.params.id}}}, {new: true});
			res.json({success: true, data});
		} else {
			res.status(400).json({success: false, message: "Cart not found with this userId"});
		}
	} catch (err) {
		res.status(400).json({success: false, message: error.message});
	}
});

module.exports = router;
