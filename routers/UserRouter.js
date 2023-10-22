const express = require("express");
const Users = require("../models/Users");

const router = express.Router();

router.get("/", async (req, res) => {
	const {userId} = req;
	const users = await Users.findOne({_id: userId});
	res.send(users);
});

// router.get("/address", async (req, res) => {
// 	const {userid} = req.headers;
// 	try {
// 		const address = await Users.findOne({_id: id}, {address: 1, _id: 0});
// 		res.json(address);
// 	} catch (error) {
// 		res.status(400).json({message: error.message, success: false});
// 	}
// });

// router.put("/", async (req, res) => {
// 	try {
// 		const users = await Users.find({});
// 		users.forEach((user) => {
// 			if (!(user.address instanceof Array)) {
// 				user.address = [user.address];
// 			}
// 		});
// 		await Users.deleteMany({});
// 		await Users.insertMany(users);
// 		res.send("done");
// 	} catch (error) {
// 		res.status(400).json({message: error.message, success: false});
// 	}
// });

module.exports = router;
