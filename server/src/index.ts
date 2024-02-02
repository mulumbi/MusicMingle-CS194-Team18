import express, { Express, Request, Response } from "express";
import pg from "pg";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { initializeApp } from "firebase-admin/app";
import isLoggedIn from "./isLoggedIn";
import cors from "cors";

dotenv.config();

const firebaseConfig = {
	apiKey: process.env.API_KEY,
	authDomain: process.env.AUTH_DOMAIN,
	projectId: process.env.PROJECT_ID,
	storageBucket: process.env.STORAGE_BUCKET,
	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	appId: process.env.APP_ID,
	measurementId: process.env.MEASUREMENT_ID,
};

initializeApp(firebaseConfig);
const app: Express = express();
const port = process.env.PORT || 3000;
const { Client } = pg;
const client = new Client({
	user: "postgres",
	host: "db",
	database: "postgres",
	password: "1234",
	port: 5432,
});
const createTable = async () => {
	await client.query(`CREATE TABLE IF NOT EXISTS users 
  (id serial PRIMARY KEY, name VARCHAR (255) UNIQUE NOT NULL, 
  email VARCHAR (255) UNIQUE NOT NULL, age INT NOT NULL);`);
};
const allowedOrigins = ["http://localhost:5173"];
const corsOptions = {
	origin: (origin, callback) => {
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) === -1) {
			var msg =
				"The CORS policy for this site does not " +
				"allow access from the specified Origin.";
			return callback(new Error(msg), false);
		}
		return callback(null, true);
	},
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

client
	.connect()
	.then(() => {
		createTable();
	})
	.catch((err) => console.log(err));

app.get("/api", (req: Request, res: Response) => {
	res.send("Express + TypeScript Blah");
});

app.get("/api/profile", [
	isLoggedIn,
	async (req, res) => {
		const { uid, email } = req.user;
		// try {
		// 	const response = await client.query(`SELECT * FROM users`);
		// 	if (response) {
		// 		res.status(200).send(response.rows);
		// 	}
		// } catch (error) {
		// 	res.status(500).send("Error");
		// 	console.log(error);
		// }
		res.status(201).json({ message: "Private route", uid, email });
	},
]);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
