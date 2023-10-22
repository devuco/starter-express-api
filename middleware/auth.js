const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	const token = req.headers.token;
	if (!token) {
		return res.status(403).send({message: "Missing token in request", success: false});
	} else {
		try {
			jwt.verify(token, process.env.TOKEN_KEY);
			const decoded = jwt.decode(token);
			req.userId = decoded.userId;
			if (decoded.isAdmin) {
				req.isAdmin = decoded.isAdmin;
			}
		} catch (error) {
			return res.status(401).send({message: "Invalid Token", data: error});
		}
		return next();
	}
};

module.exports = verifyToken;
