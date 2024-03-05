import ffmpeg from "fluent-ffmpeg";
import { getAuth } from "firebase-admin/auth";
import sharp from "sharp";
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import models, { sequelize } from "./db";
import { Op, Sequelize } from "sequelize";
import { v4 as uuidv4 } from "uuid";

const bucketStorage = new Storage({
	keyFilename: `/usr/src/app/config/musicmingle-847509563d60.json`,
});
const profileBucket = bucketStorage.bucket("music-mingle-profile");
const videoBucket = bucketStorage.bucket("music-mingle-video");
const portfolioImageBucket = bucketStorage.bucket(
	"music-mingle-portfolio-bucket"
);
const gigImageBucket = bucketStorage.bucket("music-mingle-gig-bucket");

// middleware for checking if user is logged in. allows the extraction of name, uid, email, etc from req.user anywhere
const isLoggedIn = (req, res, next) => {
	const token = req.headers.authorization;
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
	if (!req.files || !req.files.profile_image) {
		next();
	} else {
		const { profile_image } = req.files;
		const { name, uid } = req.user;

		if (profile_image?.length === 1) {
			// Delete old image from db
			const user = await models.UserContent.findOne({
				where: { uuid: uid },
			});
			const old_image = await user.getUserContents({
				where: { type: "profileImage" },
			});
			await old_image.destroy();

			const ref = `${name}-profile.webp`;
			const file = profileBucket.file(ref);
			sharp(profile_image[0].path)
				.webp({ quality: 70 })
				.toBuffer()
				.then((data) => {
					file.save(data)
						.then(() => {
							fs.unlink(profile_image[0].path, (err) => {
								console.log(err);
							});
							file.makePublic().catch((err) => {
								console.log("Error verifying token:", err);
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
						});
				})
				.catch((err) => {
					res.status(501).json({
						error: `Parse profile image error: ${err}`,
					});
				});
			req.profile_image = {
				ref: ref,
				url: file.publicUrl(),
			};
			next();
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
			portfolio_images.forEach(async (image) => {
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
				sharp(path)
					.webp({ quality: 70 })
					.toBuffer()
					.then((data) => {
						file.save(data)
							.then(() => {
								fs.unlink(path, (err) => {
									console.log(err);
								});
								file.makePublic().catch((err) => {
									console.log("Error verifying token:", err);
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
							});
					})
					.catch((err) => {
						res.status(501).json({
							error: `Parse profile image error: ${err}`,
						});
					});
				portfolio_images_obj.push(user_content);
			});
			await Promise.allSettled(portfolio_images_obj);
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

		if (videos?.length > 0) {
			const videos_objs = [];
			videos.forEach(async (video) => {
				const { path, originalname } = video;
				const name = req.user?.name || "Jason Mei";
				const ref = `tmp/${name}-${originalname}.mp4`;
				const fileName = ref.slice(4);
				const file = videoBucket.file(ref.slice(4));

				const user_content = await user.createUserContent({
					type: "portfolioVideos",
					file_name: fileName,
					public_url: file.publicUrl(),
				});

				ffmpeg()
					.input(path)
					.format("mp4")
					.fps(30)
					.addOptions(["-crf 28"])
					.save(ref)
					.on("error", function (err) {
						console.log("An error occurred: " + err.message);
					})
					.on("end", function () {
						console.log("unlink");
						fs.unlink(path, (err) => {
							if (err)
								console.log("// Error when uploading", err);
						});
						fs.createReadStream(ref)
							.pipe(file.createWriteStream())
							.on("error", function (err) {
								if (err)
									console.log("// Error when uploading", err);
							})
							.on("finish", function () {
								file.makePublic().catch((err) =>
									console.log("Video file error public:", err)
								);
								fs.unlink(ref, (err) => {
									if (err)
										console.log("Video unlink err:", err);
								});
							});
					});
				videos_objs.push(user_content);
			});
			await Promise.allSettled(videos_objs);
			req.videos = videos_objs;
			next();
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
			gig_images.forEach(async (image) => {
				const { path, originalname } = image;
				const ref = `${uuidv4()}-${originalname}.webp`;
				const file = gigImageBucket.file(ref);
				// Optimize image, upload to google cloud storage, make image public
				sharp(path)
					.webp({ quality: 70 })
					.toBuffer()
					.then((data) => {
						file.save(data)
							.then(() => {
								fs.unlink(path, (err) => {
									console.log(err);
								});
								file.makePublic().catch((err) => {
									console.log("Error verifying token:", err);
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
							});
					})
					.catch((err) => {
						res.status(501).json({
							error: `Parse profile image error: ${err}`,
						});
					});
				gigImages.push({
					type: "gigImage",
					file_name: ref,
					public_url: file.publicUrl(),
				});
			});
			await Promise.allSettled(gigImages);
			req.gig_images = gigImages;
		}
		const gigProfileImage = {};
		if (gig_profile_image.length > 0) {
			gig_profile_image.forEach((image) => {
				const { path, originalname } = image;
				const ref = `${uuidv4()}-${originalname}.webp`;
				const file = gigImageBucket.file(ref);
				// Optimize image, upload to google cloud storage, make image public
				sharp(path)
					.webp({ quality: 70 })
					.toBuffer()
					.then((data) => {
						file.save(data)
							.then(() => {
								fs.unlink(path, (err) => {
									console.log(err);
								});
								file.makePublic().catch((err) => {
									console.log("Error verifying token:", err);
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
							});
					})
					.catch((err) => {
						res.status(501).json({
							error: `Parse profile image error: ${err}`,
						});
					});
				gigProfileImage["type"] = "gigProfileImage";
				gigProfileImage["file_name"] = ref;
				gigProfileImage["public_url"] = file.publicUrl();
			});
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
	} = req.query;
	const query: any = [{ is_artist: true }];
	if (organization_size_start) {
		query.push({
			organization_group_size: { [Op.gt]: organization_size_start },
		});
	}
	if (organization_size_end) {
		query.push({
			organization_group_size: { [Op.lt]: organization_size_end },
		});
	}
	if (flat_rate_start) {
		query.push({ estimate_flat_rate: { [Op.gt]: flat_rate_start } });
	}
	if (flat_rate_end) {
		query.push({ estimate_flat_rate: { [Op.lt]: flat_rate_end } });
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
	console.log(user_role_tags, "User Role Tags");
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

	return users;
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
	} = req.query;
	const query: any = [{ is_open: true }];
	if (event_start) {
		query.push({ event_start: { [Op.gt]: event_start } });
	}
	if (event_end) {
		query.push({ event_end: { [Op.lt]: event_end } });
	}
	if (flat_rate_start) {
		query.push({ event_end: { [Op.gt]: flat_rate_start } });
	}
	if (flat_rate_end) {
		query.push({ event_end: { [Op.lt]: flat_rate_end } });
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

	const gigs = await models.Gig.findAll({
		where: {
			[Op.and]: query,
		},
		order: [["name", "DESC"]],
		limit: limit ? limit : 10,
		offset: offset ? offset : 0,
	});
	const formattedGigs = gigs.map((gig) => {
		const { UserId, ...data } = gig.dataValues;
		return {
			userId: UserId,
			...data,
		};
	});

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
};
