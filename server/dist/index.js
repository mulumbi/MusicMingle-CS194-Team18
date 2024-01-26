"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const { Client } = pg_1.default;
const client = new Client({
    user: "postgres",
    host: "db",
    database: "postgres",
    password: "1234",
    port: 5432,
});
client.connect();
const createTable = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.query(`CREATE TABLE IF NOT EXISTS users 
  (id serial PRIMARY KEY, name VARCHAR (255) UNIQUE NOT NULL, 
  email VARCHAR (255) UNIQUE NOT NULL, age INT NOT NULL);`);
});
createTable();
app.get("/api", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.get("/api/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield client.query(`SELECT * FROM users`);
        if (response) {
            res.status(200).send(response.rows);
        }
    }
    catch (error) {
        res.status(500).send("Error");
        console.log(error);
    }
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
