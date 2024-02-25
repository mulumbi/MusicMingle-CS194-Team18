import express, { Express, Request, Response } from "express";
import pg from "pg";
import bodyParser from "body-parser";
import { Storage } from "@google-cloud/storage";
import multer from "multer";
import dotenv from "dotenv";
import { initializeApp } from "firebase-admin/app";
import cors from "cors";
import models, { sequelize, testDbConnection } from "./db";

import {
	getProfileDetails,
	isLoggedIn,
	uploadPortfolioImages,
	uploadProfileImage,
	uploadVideos,
	uploadGigImages,
	formatDateTime,
	searchGigs,
	searchArtists,
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
app.use(bodyParser.json());

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
		sequelize;
		// .sync({ force: true })
		// sequelize.sync({ alter: true })
		sequelize
			.sync()
			//
			.then(() => {
				console.log("Model Sync Complete");
				testDbConnection();
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
		const profileDetails = await getProfileDetails(req, res);
		res.status(201).json(profileDetails);
	},
]);

app.get("/api/artists", async (req, res) => {
	const users = await searchArtists(req, res);
	res.status(201).json(users);
});

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
			deleted_portfolio_images,
			deleted_videos,
			bio,
			user_genre_tags,
			user_role_tags,
			organization_name,
			organization_group_size,
			estimate_flat_rate,
		} = req.body;
		const { uid, name, email } = req.user;

		const user = await models.User.findOne({ where: { uuid: uid } });
		const updated = await user.update({
			bio,
			user_genre_tags,
			user_role_tags,
			organization_name,
			organization_group_size,
			estimate_flat_rate,
		});

		const promises = [];

		const ids_of_port_images_to_delete = deleted_portfolio_images
			? JSON.parse(deleted_portfolio_images)
			: [];
		const ids_of_videos_to_delete = deleted_videos
			? JSON.parse(deleted_videos)
			: [];

		if (!!ids_of_port_images_to_delete) {
			console.log(ids_of_port_images_to_delete);
			ids_of_port_images_to_delete.forEach(
				async (del_portfolio_image_id) => {
					models.UserContent.findByPk(del_portfolio_image_id).then(
						async (user_content) => {
							// destroy from google bucket then from db
							promises.push(
								portfolioImageBucket
									.file(user_content.file_name)
									.delete()
									.then(user_content.destroy())
							);
							await user.removeUserContent(user_content);
						}
					);
				}
			);
		}

		// delete old videos
		if (!!ids_of_videos_to_delete) {
			ids_of_videos_to_delete.forEach(async (del_video_id) => {
				models.UserContent.findByPk(del_video_id).then(
					async (user_content) => {
						// destroy from google bucket then from db
						promises.push(
							videoBucket
								.file(user_content.file_name)
								.delete()
								.then(user_content.destroy())
						);
						await user.removeUserContent(user_content);
					}
				);
			});
		}

		await Promise.allSettled(promises);

		const profileDetails = await getProfileDetails(req, res);
		res.status(201).json(profileDetails);
	}
);

// returns list of your gigs, add param like below for individual gig:
// exp: localhost/api/mygigs/?gig_id=2dc4080e-82c8-4858-b669-e1ab3f45bb49
app.get("/api/mygigs/", isLoggedIn, async (req: any, res) => {
	const { uid } = req.user;
	const { gig_id } = req.query;
	const user = await models.User.findOne({ where: { uuid: uid } });
	const myGigs = await user.getGigs({
		where: gig_id ? { id: gig_id } : {},
	});
	const retGig = await Promise.all(
		myGigs.map(async (gig) => {
			const content = await gig.getUserContents();
			const values = {
				...gig.dataValues,
				gigImages: content.map((image) => image.dataValues),
			};
			return values;
		})
	);
	res.status(201).json(retGig);
});

// exp: localhost/api/search_gigs?name="bla"&gig_tags=["musician", "party"]&event_start="2024-02-25T10:55:38.033Z"
app.get("/api/search_gigs", async (req: any, res) => {
	const searchedGigs = await searchGigs(req, res);
	res.status(201).json(searchedGigs);
});

// edit a gig
app.post(
	"/api/mygigs/edit",
	isLoggedIn,
	fileUpload.fields([{ name: "gig_images" }]),
	uploadGigImages,
	async (req: any, res) => {
		const { uid } = req.user;
		const {
			gig_id,
			event_start,
			event_end,
			gig_tags,
			name,
			bio,
			estimate_flat_rate,
			deleted_gig_images,
		} = req.body;
		if (name === "" || event_start === "" || event_end === "") {
			res.status(401).json(
				"Error: Name, event_start, event_end cannot be empty"
			);
			res.end();
			return;
		}

		const user = await models.User.findOne({
			where: { uuid: uid },
		});

		const gig = await models.Gig.findOne({
			where: { UserId: user.id, id: gig_id },
		});

		const updatedGig = await gig.update(
			{
				event_start: event_start
					? formatDateTime(event_start)
					: undefined,
				event_end: event_start ? formatDateTime(event_end) : undefined,
				gig_tags: gig_tags ? JSON.parse(gig_tags) : undefined,
				name,
				bio,
				estimate_flat_rate,
			},
			{
				where: { UserId: user.id, id: gig_id },
			}
		);
		if (req.gig_images) {
			req.gig_images.forEach(async (gig_image) => {
				const newContent = await gig.createUserContent(gig_image);
				await newContent.save();
			});
		}

		const promises = [];
		const ids_of_images_to_delete = deleted_gig_images
			? JSON.parse(deleted_gig_images)
			: [];
		if (!!ids_of_images_to_delete) {
			ids_of_images_to_delete.forEach(async (del_gig_image_id) => {
				models.UserContent.findByPk(del_gig_image_id).then(
					async (user_content) => {
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
			await models.UserContent.destroy({
				where: { id: ids_of_images_to_delete },
			});
		}
		await Promise.allSettled(promises);
		res.status(201).json(gig);
	}
);

// Create gigs, event_start, event_end, name required
app.post(
	"/api/gigs/create",
	isLoggedIn,
	fileUpload.fields([{ name: "gig_images" }]),
	uploadGigImages,
	async (req: any, res) => {
		const {
			event_start,
			event_end,
			gig_tags,
			name,
			bio,
			estimate_flat_rate,
		} = req.body;
		const { uid } = req.user;
		if (!event_start || !event_end || !name) {
			res.status(401).json(
				"Error: Name, event_start, event_end cannot be empty"
			);
			res.end();
			return;
		}
		const user = await models.User.findOne({ where: { uuid: uid } });
		const new_gig = await models.Gig.create({
			event_start: formatDateTime(event_start),
			event_end: formatDateTime(event_end),
			gig_tags,
			name,
			bio,
			estimate_flat_rate,
		});
		if (req.gig_images) {
			req.gig_images.forEach(async (gig_image) => {
				const newContent = await new_gig.createUserContent(gig_image);
				await newContent.save();
			});
		}

		await user.addGig(new_gig);
		await new_gig.save();
		res.status(201).json(new_gig);
	}
);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
