import express, { Express, Request, Response } from "express";
import pg from "pg";
import bodyParser from "body-parser";
import { Storage } from "@google-cloud/storage";
import multer from "multer";
import dotenv from "dotenv";
import { initializeApp } from "firebase-admin/app";
import cors from "cors";
import models, { sequelize } from "./db";

import {
	isLoggedIn,
	uploadPortfolioImages,
	uploadProfileImage,
	uploadVideos,
} from "./helper";

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

const fileUpload = multer({
	storage: multer.diskStorage({
		destination: "./tmp/",
		filename: (req, file, cb) => {
			cb(null, file.originalname);
		},
	}),
});
const port = process.env.PORT || 3000;
const { Client } = pg;
const client = new Client({
	user: "postgres",
	host: "db",
	database: "postgres",
	password: "1234",
	port: 5432,
});

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

const bucketStorage = new Storage({
	keyFilename: `/usr/src/app/config/musicmingle-847509563d60.json`,
});
const videoBucket = bucketStorage.bucket("music-mingle-video");
const portfolioImageBucket = bucketStorage.bucket(
	"music-mingle-portfolio-bucket"
);

client
	.connect()
	.then(() => {
		// User.sync() - This creates the table if it doesn't exist (and does nothing if it already exists)
		// User.sync({ force: true }) - This creates the table, dropping it first if it already existed
		/* User.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, 
		 what are their data types, etc), and then performs the necessary changes in the table to make it match the model. */
		sequelize.sync({ alter: true }).then(() => {
			console.log("Model Sync Complete");
		});
	})
	.catch((err) => console.log(err));

app.get("/api", (req: Request, res: Response) => {
	res.send("Express Api");
});

/*
	Get user profile details
*/
app.get("/api/profile", [
	isLoggedIn,
	async (req, res) => {
		const { uid, email } = req.user;

		const user = await models.User.findByPk(uid);
		const profileImage = await user.getUserContents({
			where: { type: "profileImage" },
		});
		const portfolioImages = await user.getUserContents({
			where: { type: "portfolioImage" },
		});
		const portfolioVideos = await user.getUserContents({
			where: { type: "portfolioVideo" },
		});

		res.status(201).json({
			uid,
			email,
			profileImage,
			portfolioImages,
			portfolioVideos,
			bio: user.bio,
		});
	},
]);

/* User profile edit:
	Add property in post request if value has changed
	Limit video upload to 5 at a time and their size
*/
app.post(
	"/api/profile/edit",
	[
		isLoggedIn,
		fileUpload.fields([
			{ name: "profile_image", maxCount: 1 },
			{ name: "portfolio_images" },
			{ name: "videos" },
		]),
		uploadProfileImage,
		uploadPortfolioImages,
		uploadVideos,
	],
	async (req: any, res) => {
		const {
			portfolio_images,
			profile_image,
			videos,
			deleted_portfolio_images,
			deleted_videos,
			bio,
		} = req;
		const { uid, name, email } = req.user;

		const user = await models.User.findByPk(uid);
		// update bio
		if (bio !== user.bio) {
			await user.update({ bio: bio });
		}

		// deleted_portfolio_images: [uids_of_deleted_images] | undefined
		// deleted_videos: [uids_of_deleted_videos] | undefined

		// delete old portfolio photos
		const promises = [];

		if (!!deleted_portfolio_images) {
			deleted_portfolio_images.forEach(async (del_portfolio_image_id) => {
				models.UserContent.findByPk(del_portfolio_image_id).then(
					(user_content) => {
						// destroy from google bucket then from db
						promises.push(
							portfolioImageBucket
								.file(user_content.file_name)
								.delete()
								.then(user_content.destroy())
						);
					}
				);
			});
		}

		// delete old videos
		if (!!deleted_videos) {
			deleted_videos.forEach(async (del_video_id) => {
				models.UserContent.findByPk(del_video_id).then(
					(user_content) => {
						// destroy from google bucket then from db
						promises.push(
							videoBucket
								.file(user_content.file_name)
								.delete()
								.then(user_content.destroy())
						);
					}
				);
			});
		}

		await Promise.allSettled(promises);
		res.sendStatus(200);
	}
);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
