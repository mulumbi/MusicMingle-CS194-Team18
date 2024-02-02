import { getAuth } from "firebase-admin/auth";

const isLoggedIn = (req, res, next) => {
	const token = req.headers.authorization;
	if (!token) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	getAuth()
		.verifyIdToken(token)
		.then((decodedToken) => {
			req.user = decodedToken;
			next();
		})
		.catch((err) => {
			console.log("Error verifying token:", err);
			res.status(401).json({ error: "Unauthorized" });
		});
};

export default isLoggedIn;
