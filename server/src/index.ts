import express, { Express, Request, Response, application } from "express";
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
	searchGigs,
	searchArtists,
	getGigDetails,
	parseFields,
	formatDateTime,
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

const allowedOrigins = [
	"http://localhost:5173",
	"https://musicmingle-cabf2.web.app/",
];
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
app.use(bodyParser.urlencoded({ extended: true }));

const bucketStorage = new Storage({
	keyFilename: `/usr/src/app/config/musicmingle-847509563d60.json`,
});
const videoBucket = bucketStorage.bucket("music-mingle-video");
const portfolioImageBucket = bucketStorage.bucket(
	"music-mingle-portfolio-bucket"
);

// Dummy data seeding function (Assuming it's defined correctly)
async function seedDummyGigs() {
	const user = await models.User.findOne(); // Assuming there's at least one user in your database
	if (!user) {
		console.log("No users found, skipping gig seeding.");
		return;
	}

	const dummyGigs = [
		{
			name: "Applied Gig 1",
			bio: "This is an applied gig.",
			estimate_flat_rate: 100,
			event_start: new Date(),
			event_end: new Date(),
			gig_role_tags: ["musician"],
			userId: user.id,
			status: "applied",
		},
		{
			name: "Applied Gig 2",
			bio: "This is another applied gig.",
			estimate_flat_rate: 150,
			event_start: new Date(),
			event_end: new Date(),
			gig_role_tags: ["singer"],
			userId: user.id,
			status: "applied",
		},
		{
			name: "Applied Gig 3",
			bio: "Yet another applied gig.",
			estimate_flat_rate: 200,
			event_start: new Date(),
			event_end: new Date(),
			gig_role_tags: ["dj"],
			userId: user.id,
			status: "applied",
		},
		{
			name: "Posted Gig 1",
			bio: "This is a posted gig.",
			estimate_flat_rate: 250,
			event_start: new Date(),
			event_end: new Date(),
			gig_role_tags: ["band"],
			userId: user.id,
			status: "posted",
		},
	];

	// Using Sequelize model to create gigs directly
	for (const gig of dummyGigs) {
		await models.Gig.create(gig);
	}

	console.log("Dummy gigs seeded successfully.");
}

// client
// 	.connect()
// 	.then(() => {
// 		// User.sync() - This creates the table if it doesn't exist (and does nothing if it already exists)
// 		// User.sync({ force: true }) - This creates the table, dropping it first if it already existed
// 		/* User.sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has,
// 		 what are their data types, etc), and then performs the necessary changes in the table to make it match the model. */
// 		sequelize
// 			// .sync({ force: true })
// 			// sequelize
// 			// 	.sync({ alter: true })
// 			.sync()

// 			.then(() => {
// 				console.log("Model Sync Complete");
// 				testDbConnection();
// 				seedDummyGigs().then(() => {
//                     console.log("Dummy data seeding completed.");
//                 }).catch((error) => {
//                     console.error("Error seeding dummy gigs:", error);
//                 });
// 			});
// 	})
// 	.catch((err) => console.log(err));

sequelize
	// .sync({ force: true })
	.sync()
	.then(async () => {
		console.log("Model Sync Complete");
		testDbConnection();
		// Call your seeding function here
		if (process.env.NODE_ENV === "development") {
			// Ensure seeding only in development
			await seedDummyGigs();
		}
		// Start your server after seeding is complete
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
		parseFields,
		fileUpload.fields([
			{ name: "profile_image" },
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
			is_artist,
		} = req.body;
		const { uid, name, email } = req.user;

		const user = await models.User.findOne({ where: { uuid: uid } });
		const updated = await user.update({
			bio,
			user_genre_tags: user_genre_tags
				? JSON.parse(user_genre_tags)
				: undefined,
			user_role_tags: user_role_tags
				? JSON.parse(user_role_tags)
				: undefined,
			organization_name,
			organization_group_size: organization_group_size
				? parseInt(organization_group_size)
				: undefined,
			estimate_flat_rate: estimate_flat_rate
				? parseInt(estimate_flat_rate)
				: undefined,
			is_artist: is_artist
				? is_artist === "true"
					? true
					: false
				: undefined,
		});
		const promises = [];

		const ids_of_port_images_to_delete = deleted_portfolio_images
			? JSON.parse(deleted_portfolio_images)
			: [];
		const ids_of_videos_to_delete = deleted_videos
			? JSON.parse(deleted_videos)
			: [];

		if (!!ids_of_port_images_to_delete) {
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
	const user = await models.User.findOne({
		where: { uuid: uid },
		include: { model: models.Application, include: [models.Gig] },
	});
	const myGigs = await user.getGigs({
		where: gig_id ? { id: gig_id } : {},
		include: { model: models.Application, include: [models.User] },
	});

	const retGig = await Promise.all(
		myGigs.map(async (gig) => {
			const content = await gig.getGigImages();
			const { UserId, Applications, ...gigData } = gig.dataValues;
			const values = {
				...gigData,
				userId: user.id,
				applications: gig.Applications.map((application) => {
					const { userId, gigId, User, ...values } =
						application.dataValues;
					return {
						user: User,
						...values,
					};
				}),
				gigImages: content
					.filter((image) => image.type === "gigImage")
					.map((image) => image.dataValues),
				gigProfileImage: content.find(
					(image) => image.type === "gigProfileImage"
				),
			};
			return values;
		})
	);
	const returnObj = {
		my_gigs: retGig,
		my_applications: await Promise.all(
			user.Applications.map(async (application) => {
				const { userId, gigId, Gig, ...values } =
					application.dataValues;
				const profileImage = await Gig.getGigImages();
				return {
					gig: Gig,
					gig_profile_image: profileImage.find(
						(image) => image.type === "gigProfileImage"
					),
					gig_images: profileImage.filter(
						(image) => image.type === "gigImage"
					),
					...values,
				};
			})
		),
	};

	res.status(201).json(returnObj);
});

// exp: localhost/api/search_gigs?name="bla"&gig_role_tags=["musician", "party"]&event_start="2024-02-25T10:55:38.033Z"
app.get("/api/search_gigs", async (req: any, res) => {
	const searchedGigs = await searchGigs(req, res);
	res.status(201).json(searchedGigs);
});

// edit a gig
app.post(
	"/api/mygigs/edit",
	isLoggedIn,
	fileUpload.fields([{ name: "gig_images" }, { name: "gig_profile_image" }]),
	uploadGigImages,
	async (req: any, res) => {
		const { uid } = req.user;
		const {
			gig_id,
			event_start,
			event_end,
			gig_role_tags,
			gig_genre_tags,
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
				event_start,
				event_end,
				gig_role_tags,
				gig_genre_tags,
				name,
				bio,
				estimate_flat_rate,
			},
			{
				where: { UserId: user.id, id: gig_id },
			}
		);

		if (req.gig_profile_image) {
			await models.UserContent.destroy({
				where: { gig_id: updatedGig.id, type: "gigProfileImage" },
			});
			const newContent = await models.UserContent.create({
				gig_id: updatedGig.id,
				...req.gig_profile_image,
			});
			await newContent.save();
		}
		if (req.gig_images) {
			req.gig_images.forEach(async (gig_image) => {
				const newContent = await gig.createGigImage(gig_image);
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
		await updatedGig.save();
		req.gig_id = gig_id;
		const gigDetails = await getGigDetails(req, res);
		res.status(201).json(gigDetails);
	}
);

app.post("/api/mygigs/close_gig", isLoggedIn, async (req: any, res) => {
	const { uid } = req.user;
	const { gig_id } = req.query;

	const user = await models.User.findOne({
		where: { uuid: uid },
	});

	const gig = await models.Gig.findOne({
		where: { UserId: user.id, id: gig_id },
	});

	const updatedGig = await gig.update(
		{
			is_open: false,
		},
		{
			where: { UserId: user.id, id: gig_id },
		}
	);
	await updatedGig.save();

	req.gig_id = gig_id;
	const gigDetails = await getGigDetails(req, res);
	res.status(201).json(gigDetails);
});

app.post("/api/mygigs/withdraw_app", isLoggedIn, async (req: any, res) => {
	const { uid } = req.user;
	const { gig_id } = req.query;
	try {
		const user = await models.User.findOne({
			where: { uuid: uid },
			include: { model: models.Application, include: models.User },
		});

		const gig = await models.Gig.findOne({ where: { id: gig_id } });
		if (gig.id) {
			await models.Application.destroy({
				where: { userId: user.id, gigId: gig_id },
			});
			res.status(201).json("Application successfully withdrawn");
		} else {
			res.status(401).json("Error: Gig not found");
		}
	} catch (error) {
		res.status(401).json(error);
	}
});

app.post("/api/gigs/application", isLoggedIn, async (req: any, res) => {
	const { uid } = req.user;
	const { gig_id } = req.query;
	try {
		const user = await models.User.findOne({
			where: { uuid: uid },
			include: { model: models.Application, include: models.User },
		});

		const gig = await models.Gig.findOne({ where: { id: gig_id } });
		const existingApplication = user.Applications.find(
			(application) => application.gigId === gig_id
		);
		if (gig.id) {
			if (existingApplication) {
				await models.Application.destroy({
					where: { id: existingApplication.id },
				});
				res.status(201).json("Application removed");
			} else {
				const application = await models.Application.create({
					userId: user.id,
					gigId: gig.id,
				});
				res.status(201).json(application);
			}
		} else {
			res.status(401).json("Error: Gig not found");
		}
	} catch (error) {
		res.status(401).json(error);
	}
});

// Create gigs, event_start, event_end, name required
app.post(
	"/api/gigs/create",
	isLoggedIn,
	parseFields,
	fileUpload.fields([{ name: "gig_images" }, { name: "gig_profile_image" }]),
	uploadGigImages,
	async (req: any, res) => {
		const {
			event_start,
			event_end,
			gig_role_tags,
			gig_genre_tags,
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
			gig_genre_tags: gig_genre_tags
				? JSON.parse(gig_genre_tags)
				: undefined,
			gig_role_tags: gig_role_tags
				? JSON.parse(gig_role_tags)
				: undefined,
			name,
			bio,
			estimate_flat_rate: estimate_flat_rate
				? parseInt(estimate_flat_rate)
				: undefined,
			is_open: true,
		});
		await new_gig.save();
		if (req.gig_profile_image) {
			const newContent = await models.UserContent.create({
				gig_id: new_gig.id,
				...req.gig_profile_image,
			});
			await newContent.save();
		}
		if (req.gig_images) {
			req.gig_images.forEach(async (gig_image) => {
				const newContent = await new_gig.createGigImage(gig_image);
				await newContent.save();
			});
		}

		await user.addGig(new_gig);
		const savedGig = await new_gig.save();
		req.gig_id = savedGig.id;
		const gigDetails = await getGigDetails(req, res);
		res.status(201).json(gigDetails);
	}
);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
