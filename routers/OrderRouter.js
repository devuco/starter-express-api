const Order = require("../models/Order");
const router = require("express").Router();

router.get("/", async (req, res) => {
	const {userId} = req;
	const {page} = req.query;
	try {
		const orders = await Order.find({userId})
			.populate("products.product", "image name price color discountedPrice discount")
			.sort({orderDate: -1})
			.skip(page * 5)
			.limit(5)
			.exec();
		res.json({success: true, data: orders});
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});
router.get("/:orderId", async (req, res) => {
	const {userId} = req;
	try {
		Order.findOne({orderId: req.params.orderId, userId})
			.populate("products.product", "image name price color discountedPrice discount")
			.exec((err, data) => {
				if (err) {
					res.status(400).json({success: false, message: err});
				} else {
					res.json({success: true, data});
				}
			});
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});

module.exports = router;
