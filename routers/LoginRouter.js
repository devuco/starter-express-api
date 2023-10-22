const express = require("express");
const Users = require("../models/Users");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
	try {
		const email = req.body.email;
		const user = await Users.findOne({email});
		if (user) {
			const userId = user._id;
			const token = jwt.sign({userId}, process.env.TOKEN_KEY, {expiresIn: "24h"});
			const userDetails = {...user._doc, token};
			res.json({success: true, data: userDetails});
		} else {
			const users = new Users(req.body);
			await users.save();
			const token = jwt.sign({userId: users._id}, process.env.TOKEN_KEY, {expiresIn: "24h"});
			const userDetails = {...users._doc, token};
			res.json({success: true, data: userDetails});
		}
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});

router.post("/", async (req, res) => {
	const {email, password} = req.body;
	try {
		const user = await Users.findOne({email, password});
		if (user) {
			const userId = user._id;
			const token = jwt.sign({userId}, process.env.TOKEN_KEY, {expiresIn: 60 * 60 * 24});
			const userDetails = {...user._doc, token};
			res.send({success: true, data: userDetails});
		} else res.status(401).send({success: false, message: "Email Id or Password is incorrect"});
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});

router.post("/admin", async (req, res) => {
	const {email, password} = req.body;
	try {
		const user = await Admin.findOne({email, password});
		if (user) {
			const userId = user._id;
			const token = jwt.sign({userId, isAdmin: true}, process.env.TOKEN_KEY, {expiresIn: 60 * 60 * 24});
			const userDetails = {...user._doc, token};
			res.send({success: true, data: userDetails});
		} else res.status(401).send({success: false, message: "Email Id or Password is incorrect"});
	} catch (error) {
		res.status(400).json({message: error.message, success: false});
	}
});

module.exports = router;
