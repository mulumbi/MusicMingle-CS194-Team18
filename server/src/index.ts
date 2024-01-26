import express, { Express, Request, Response } from "express";
import pg from "pg";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

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
client.connect();

const createTable = async () => {
	await client.query(`CREATE TABLE IF NOT EXISTS users 
  (id serial PRIMARY KEY, name VARCHAR (255) UNIQUE NOT NULL, 
  email VARCHAR (255) UNIQUE NOT NULL, age INT NOT NULL);`);
};

createTable();

app.get("/api", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
});

app.get("/api/all", async (req, res) => {
	try {
		const response = await client.query(`SELECT * FROM users`);

		if (response) {
			res.status(200).send(response.rows);
		}
	} catch (error) {
		res.status(500).send("Error");
		console.log(error);
	}
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
