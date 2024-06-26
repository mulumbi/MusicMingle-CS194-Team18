import ffmpeg from "fluent-ffmpeg";
import { getAuth } from "firebase-admin/auth";
import sharp from "sharp";
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import models, { sequelize } from "./db";
import { Op, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises } from "dns";

const bucketStorage = new Storage({
	keyFilename: `config/musicmingle-847509563d60.json`,
});
const profileBucket = bucketStorage.bucket("music-mingle-profile");
const videoBucket = bucketStorage.bucket("music-mingle-video");
const portfolioImageBucket = bucketStorage.bucket(
	"music-mingle-portfolio-bucket"
);
const gigImageBucket = bucketStorage.bucket("music-mingle-gig-bucket");

const parseFields = (req, res, next) => {
	console.log(req.body, "Body");
	const {
		user_genre_tags,
		user_role_tags,
		organization_group_size,
		estimate_flat_rate,
		is_artist,
		gig_role_tags,
		gig_genre_tags,
		event_end,
		event_start,
	} = req.body;
	if (user_genre_tags) {
		req.body.user_genre_tags = JSON.parse(user_genre_tags);
	}
	if (user_role_tags) {
		req.body.user_role_tags = JSON.parse(user_role_tags);
	}
	if (organization_group_size) {
		req.body.organization_group_size = parseInt(organization_group_size);
	}
	if (estimate_flat_rate) {
		req.body.estimate_flat_rate = parseInt(estimate_flat_rate);
	}
	if (is_artist) {
		req.body.is_artist = is_artist === "true" ? true : false;
	}
	if (gig_role_tags) {
		req.body.gig_role_tags = JSON.parse(gig_role_tags);
	}
	if (gig_genre_tags) {
		req.body.gig_genre_tags = JSON.parse(gig_genre_tags);
	}
	if (event_start) {
		req.body.event_start = formatDateTime(event_start);
	}
	if (event_end) {
		req.body.event_end = formatDateTime(event_end);
	}
	next();
};

// middleware for checking if user is logged in. allows the extraction of name, uid, email, etc from req.user anywhere
const isLoggedIn = (req, res, next) => {
	const token =
		req.headers.authorization || req?.body?.headers?.authorization;
	if (!token) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	getAuth()
		.verifyIdToken(token)
		.then((decodedToken) => {
			req.user = decodedToken;
			const { uid, email, name, picture } = decodedToken;
			models.User.findOne({ where: { uuid: uid } })
				.then(async (user) => {
					if (!user) {
						const newUser = await models.User.create({
							uuid: uid,
							name: name,
							email: email,
							bio: "",
							user_genre_tags: [],
							user_role_tags: [],
							organization_name: "",
							organization_group_size: 1,
						});
						const newUserContent = await newUser.createUserContent({
							type: "profileImage",
							file_name: name + "-Profile.webp",
							public_url: picture,
						});
						await newUserContent.save();
						next();
						//console.log(await newUserContent.getUser());
					} else {
						next();
					}
				})
				.catch((err) => console.log("Find by pk error: ", err));
		})
		.catch((err) => {
			console.log("Error verifying token:", err);
			res.status(401).json({ error: "Unauthorized" });
		});
};

// Optimizes profile image for upload, create profile image instance in db, upload image to google cloud storage
const uploadProfileImage = async (req, res, next) => {
	console.log(req.files, "Files");
	if (!req.files || !req.files.profile_image) {
		next();
	} else {
		const { profile_image } = req.files;
		const { name, uid } = req.user;
		console.log(profile_image, "Profile Image");
		if (profile_image?.length === 1) {
			// Delete old image from db
			const user = await models.User.findOne({
				where: { uuid: uid },
			});
			const old_image = await user.getUserContents({
				where: { type: "profileImage" },
			});
			if (old_image.length > 0) {
				await old_image[0].destroy();
			}
			const ref = `${name}-${profile_image[0].filename}-profile.webp`;
			const file = profileBucket.file(ref);
			const new_image = await user.createUserContent({
				type: "profileImage",
				file_name: ref,
				public_url: file.publicUrl(),
			});
			await new_image.save();
			sharp(profile_image[0].path)
				.webp({ quality: 70 })
				.toBuffer()
				.then((data) => {
					file.save(data)
						.then(() => {
							fs.unlink(profile_image[0].path, (err) => {
								console.log(err);
							});
							file.makePublic()
								.then(() => next())
								.catch((err) => {
									console.log("Error verifying token:", err);
									res.status(501).json({
										error: `Profile make public error: ${err}`,
									});
									next();
								});
						})
						.catch((err) => {
							console.log("Save error:", err);
							res.status(501).json({
								error: `Save profile error: ${err}`,
							});
							next();
						});
				})
				.catch((err) => {
					res.status(501).json({
						error: `Parse profile image error: ${err}`,
					});
					next();
				});
		} else {
			next();
		}
	}
};

// Optimizes images for upload, uploads images to google cloud storage for public url, creates portfolio image instances in db
const uploadPortfolioImages = async (req, res, next) => {
	if (!req.files || !req.files.portfolio_images) {
		next();
	} else {
		const { portfolio_images } = req.files;
		const { uid, name, email } = req.user;

		const user = await models.User.findOne({ where: { uuid: uid } });

		if (portfolio_images?.length > 0) {
			const portfolio_images_obj = [];
			const portfolioUploadPromises = portfolio_images.map(
				async (image) => {
					const { path, originalname } = image;
					const name = req.user?.name || "Jason Mei";
					const ref = `${name}-${originalname}.webp`;
					const file = portfolioImageBucket.file(ref);
					// Create portfolio image instance
					const user_content = await user.createUserContent({
						type: "portfolioImage",
						file_name: ref,
						public_url: file.publicUrl(),
						// UserId: uid,
					});
					// Optimize image, upload to google cloud storage, make image public
					await new Promise((resolve, reject) => {
						sharp(path)
							.webp({ quality: 70 })
							.toBuffer()
							.then((data) => {
								file.save(data)
									.then(() => {
										fs.unlink(path, (err) => {
											console.log(err);
										});
										file.makePublic()
											.then(() => {
												resolve(true);
											})
											.catch((err) => {
												console.log(
													"Error verifying token:",
													err
												);
												reject(false);
												res.status(501).json({
													error: `Profile make public error: ${err}`,
												});
											});
									})
									.catch((err) => {
										console.log("Save error:", err);
										res.status(501).json({
											error: `Save profile error: ${err}`,
										});
										reject(false);
									});
							})
							.catch((err) => {
								res.status(501).json({
									error: `Parse profile image error: ${err}`,
								});
								reject(false);
							});
					});
					return user_content;
				}
			);
			await Promise.allSettled(portfolioUploadPromises);
			req.portfolio_images = portfolio_images_obj;
			next();
		} else {
			next();
		}
	}
};

// Optimizes videos for upload, uploads videos to google cloud storage for public url, creates portfolio videos instances in db
const uploadVideos = async (req, res, next) => {
	if (!req.files || !req.files.videos) {
		next();
	} else {
		const { videos } = req.files;
		const { uid } = req.user;

		const user = await models.User.findOne({ where: { uuid: uid } });
		console.log(videos, "videos");
		if (videos?.length > 0) {
			const videoUploadPromises = videos.map(async (video) => {
				const { path, originalname } = video;
				const name = req.user?.name || "Jason Mei";
				const ref = `tmp/${name}-${originalname}.mp4`;
				const fileName = ref.slice(4);
				const file = videoBucket.file(ref.slice(4));

				const user_content = await user.createUserContent({
					type: "portfolioVideo",
					file_name: fileName,
					public_url: file.publicUrl(),
				});

				await new Promise((resolve, reject) => {
					ffmpeg()
						.input(path)
						.format("mp4")
						.fps(30)
						.addOptions(["-crf 28"])
						.save(ref)
						.on("error", () => reject(false))
						.on("end", () => {
							fs.unlink(path, (err) => {
								if (err)
									console.log(
										"// Error when deleting temp file",
										err
									);
							});

							fs.createReadStream(ref)
								.pipe(file.createWriteStream())
								.on("error", () => reject(false))
								.on("finish", async () => {
									await file.makePublic();
									fs.unlink(ref, (err) => {
										if (err)
											console.log(
												"Video unlink err:",
												err
											);
									});
									resolve(true); // Resolve after file is public
								});
						});
				});

				return user_content;
			});
			Promise.all(videoUploadPromises)
				.then(() => {
					fs.readdir("tmp", (err, files) => {
						if (err) {
							// Handle errors, such as the folder not existing
							console.error("Error reading folder:", err);
						} else {
							if (files.length > 0) {
								files.forEach((file) => {
									const filePath = path.join("tmp", file);
									fs.unlink(filePath, (err) => {
										if (err) {
											console.error(
												"Error deleting file:",
												err
											);
										} else {
											console.log(
												"Deleted file:",
												filePath
											);
										}
									});
								});
							} else {
								// Folder is already empty
								console.log("Folder is empty.");
							}
						}
					});
				})
				.finally(() => {
					next();
				});
		} else {
			next();
		}
	}
};

const getGigDetails = async (req, res) => {
	const { gig_id } = req;
	const gig = await models.Gig.findByPk(gig_id);

	return gig;
};

const uploadGigImages = async (req, res, next) => {
	if (!req.files || (!req.files.gig_images && !req.files.gig_profile_image)) {
		next();
	} else {
		const { gig_images, gig_profile_image } = req.files;
		if (gig_images?.length > 0) {
			const gigImages = [];
			const gigImageUploads = gig_images.map(async (image) => {
				const { path, originalname } = image;
				const ref = `${uuidv4()}-${originalname}.webp`;
				const file = gigImageBucket.file(ref);
				// Optimize image, upload to google cloud storage, make image public
				await new Promise((resolve, reject) => {
					sharp(path)
						.webp({ quality: 70 })
						.toBuffer()
						.then((data) => {
							file.save(data)
								.then(() => {
									fs.unlink(path, (err) => {
										console.log(err);
									});
									file.makePublic()
										.then(() => resolve(true))
										.catch((err) => {
											console.log(
												"Error verifying token:",
												err
											);
											reject(false);
											res.status(501).json({
												error: `Profile make public error: ${err}`,
											});
										});
								})
								.catch((err) => {
									console.log("Save error:", err);
									reject(false);
									res.status(501).json({
										error: `Save profile error: ${err}`,
									});
								});
						})
						.catch((err) => {
							reject(false);
							res.status(501).json({
								error: `Parse profile image error: ${err}`,
							});
						});
				});
				gigImages.push({
					type: "gigImage",
					file_name: ref,
					public_url: file.publicUrl(),
				});
			});
			await Promise.allSettled(gigImageUploads);
			req.gig_images = gigImages;
		}
		const gigProfileImage = {};
		if (gig_profile_image.length > 0) {
			const profileImageUpload = gig_profile_image.map(async (image) => {
				const { path, originalname } = image;
				const ref = `${uuidv4()}-${originalname}.webp`;
				const file = gigImageBucket.file(ref);
				// Optimize image, upload to google cloud storage, make image public
				await new Promise((resolve, reject) => {
					sharp(path)
						.webp({ quality: 70 })
						.toBuffer()
						.then((data) => {
							file.save(data)
								.then(() => {
									fs.unlink(path, (err) => {
										console.log(err);
									});
									file.makePublic()
										.then(() => resolve(true))
										.catch((err) => {
											console.log(
												"Error verifying token:",
												err
											);
											reject(false);
											res.status(501).json({
												error: `Profile make public error: ${err}`,
											});
										});
								})
								.catch((err) => {
									console.log("Save error:", err);
									reject(false);
									res.status(501).json({
										error: `Save profile error: ${err}`,
									});
								});
						})
						.catch((err) => {
							reject(false);
							res.status(501).json({
								error: `Parse profile image error: ${err}`,
							});
						});
				});
				gigProfileImage["type"] = "gigProfileImage";
				gigProfileImage["file_name"] = ref;
				gigProfileImage["public_url"] = file.publicUrl();
			});
			await Promise.allSettled(profileImageUpload);
			req.gig_profile_image = gigProfileImage;
		}
		next();
	}
};

const tagParser = (tags) => {
	if (!tags) return [];
	return JSON.parse(tags)
		.map((tag) => `'${tag}'`)
		.join(", ");
};

const searchArtists = async (req, res) => {
	const {
		user_role_tags,
		user_genre_tags,
		name,
		flat_rate_start,
		flat_rate_end,
		organization_name,
		organization_size_start,
		organization_size_end,
		limit,
		offset,
		artist_id,
	} = req.query;
	if (artist_id) {
		const user = await models.User.findOne({
			where: { is_artist: true, id: artist_id },
		});
		const profileImage = await user.getUserContents({
			where: { type: "profileImage" },
		});
		const portfolioImages = await user.getUserContents({
			where: { type: "portfolioImage" },
		});
		const portfolioVideos = await user.getUserContents({
			where: { type: "portfolioVideo" },
		});
		return {
			...user.dataValues,
			profileImage,
			portfolioImages,
			portfolioVideos,
		};
	}
	const query: any = [{ is_artist: true }];
	if (organization_size_start) {
		query.push({
			organization_group_size: { [Op.gte]: organization_size_start },
		});
	}
	if (organization_size_end) {
		query.push({
			organization_group_size: { [Op.lte]: organization_size_end },
		});
	}
	if (flat_rate_start) {
		query.push({
			estimate_flat_rate: { [Op.gte]: parseInt(flat_rate_start) },
		});
	}
	if (flat_rate_end) {
		query.push({
			estimate_flat_rate: { [Op.lte]: parseInt(flat_rate_end) },
		});
	}
	if (name) {
		query.push({
			[Op.or]: [
				{
					name: Sequelize.literal(
						`tsvector_name @@ to_tsquery('${name}:* ')`
					),
				},
				{
					name: Sequelize.literal(
						`tsvector_organization @@ to_tsquery('${organization_name}:* ')`
					),
				},
			],
		});
	}
	const parsed_user_role_tags = tagParser(user_role_tags);
	query.push({
		user_role_tags: Sequelize.literal(
			`ARRAY[${parsed_user_role_tags}]::varchar[] <@ user_role_tags`
		),
	});
	const parsed_user_genre_tags = tagParser(user_genre_tags);
	query.push({
		user_genre_tags: Sequelize.literal(
			`ARRAY[${parsed_user_genre_tags}]::varchar[] <@ user_genre_tags`
		),
	});
	console.log(query, "Query");
	const users = await models.User.findAll({
		where: {
			[Op.and]: query,
		},
		order: [["name", "DESC"]],
		limit: limit ? limit : 10,
		offset: offset ? offset : 0,
	});

	const formattedUsers = await Promise.all(
		users.map(async (user) => {
			const userModel = await models.User.findOne({
				where: { id: user.id },
			});
			const profileImage = await userModel.getUserContents({
				where: { type: "profileImage" },
			});
			return {
				...user.dataValues,
				profileImage,
			};
		})
	);

	return formattedUsers;
};

const searchGigs = async (req, res) => {
	const {
		event_start,
		event_end,
		gig_role_tags,
		gig_genre_tags,
		name,
		flat_rate_start,
		flat_rate_end,
		limit,
		offset,
		gig_id,
	} = req.query;
	if (gig_id) {
		const token =
			req.headers.authorization || req?.body?.headers?.authorization;
		const decodedToken = await getAuth().verifyIdToken(token);
		const user = await models.User.findOne({ uuid: decodedToken.uid });
		const application = await models.Application.findOne({
			where: {
				gigId: gig_id,
				userId: user.id,
			},
		});
		console.log(application, gig_id, "Application");
		const gig = (await models.Gig.findByPk(gig_id)) || null;
		const content = gig ? await gig?.getGigImages() : [];
		return {
			...gig?.dataValues,
			application: application ? application.dataValues : null,
			gigImages: content
				.filter((image) => image.type === "gigImage")
				.map((image) => image.dataValues),
			gigProfileImage: content.find(
				(image) => image.type === "gigProfileImage"
			),
		};
	}
	const query: any = [{ is_open: true }];
	if (event_start) {
		query.push({ event_start: { [Op.gte]: event_start } });
	}
	if (event_end) {
		query.push({ event_end: { [Op.lte]: event_end } });
	}
	if (flat_rate_start) {
		query.push({
			estimate_flat_rate: { [Op.gte]: parseInt(flat_rate_start) },
		});
	}
	if (flat_rate_end) {
		query.push({
			estimate_flat_rate: { [Op.lte]: parseInt(flat_rate_end) },
		});
	}
	if (name) {
		query.push({
			name: Sequelize.literal(`tsvector_name @@ to_tsquery('${name}:*')`),
		});
	}
	if (gig_role_tags?.length > 0) {
		const tags = JSON.parse(gig_role_tags)
			.map((tag) => `'${tag}'`)
			.join(", ");
		query.push({
			gig_role_tags: Sequelize.literal(
				`ARRAY[${tags}]::varchar[] <@ gig_role_tags`
			),
		});
	}
	if (gig_genre_tags?.length > 0) {
		const tags = JSON.parse(gig_genre_tags)
			.map((tag) => `'${tag}'`)
			.join(", ");
		query.push({
			gig_genre_tags: Sequelize.literal(
				`ARRAY[${tags}]::varchar[] <@ gig_genre_tags`
			),
		});
	}
	console.log(query, "Query");
	const gigs = await models.Gig.findAll({
		where: {
			[Op.and]: query,
		},
		order: [["name", "DESC"]],
		limit: limit ? limit : 10,
		offset: offset ? offset : 0,
	});
	const formattedGigs = await Promise.all(
		gigs.map(async (gig) => {
			const content = await gig.getGigImages();
			const { ...gigData } = gig.dataValues;
			const values = {
				...gigData,
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

	console.log(formattedGigs, "Gigs");

	return formattedGigs;
};

const getProfileDetails = async (req, res) => {
	const { uid, email } = req.user;

	const user = await models.User.findOne({ where: { uuid: uid } });
	const profileImage = await user.getUserContents({
		where: { type: "profileImage" },
	});
	const portfolioImages = await user.getUserContents({
		where: { type: "portfolioImage" },
	});
	const portfolioVideos = await user.getUserContents({
		where: { type: "portfolioVideo" },
	});
	const { id, ...data } = user.dataValues;

	return {
		...data,
		profileImage,
		portfolioImages,
		portfolioVideos,
	};
};

const formatDateTime = (dateTime: string) => {
	const date = new Date(dateTime);
	const isoString = date.toISOString();
	const isoDate = isoString.slice(0, 10); // YYYY-MM-DD
	const isoTime = isoString.slice(11, 23); // HH:MM:SS.MS
	const postgresTimestamp = `${isoDate} ${isoTime}`;

	return postgresTimestamp; //YYYY-MM-DD HH:MM:SS.MS
};

export {
	isLoggedIn,
	uploadProfileImage,
	uploadPortfolioImages,
	uploadVideos,
	getProfileDetails,
	getGigDetails,
	searchGigs,
	uploadGigImages,
	formatDateTime,
	searchArtists,
	parseFields,
};
