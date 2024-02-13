import ffmpeg from "fluent-ffmpeg";
import { getAuth } from "firebase-admin/auth";
import sharp from "sharp";
import { Storage } from "@google-cloud/storage";
import fs from "fs";
import models from "./db";

const bucketStorage = new Storage({
	keyFilename: `/usr/src/app/config/musicmingle-847509563d60.json`,
});
const profileBucket = bucketStorage.bucket("music-mingle-profile");
const videoBucket = bucketStorage.bucket("music-mingle-video");
const portfolioImageBucket = bucketStorage.bucket(
	"music-mingle-portfolio-bucket"
);

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
			models.User.findByPk(uid)
				.then(async (user) => {
					if (!user) {
						const newUser = await models.User.create({
							id: uid,
							name: name,
							email: email,
							bio: "",
						});
						const newUserContent = await newUser.createUserContent({
							type: "profileImage",
							file_name: name + "-Profile.webp",
							public_url: picture,
							UserId: uid,
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
		console.log("upload profile image");
		const { profile_image } = req.files;
		const { name, uid } = req.user;

		if (profile_image?.length === 1) {
			// Delete old image from db
			const user = await models.UserContent.findByPk(uid);
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

		const user = await models.UserContent.findByPk(uid);

		if (portfolio_images?.length > 0) {
			const portfolio_images_obj = [];
			portfolio_images.forEach(async (image) => {
				const { path, originalname } = image;
				const name = req.user?.name || "Jason Mei";
				const ref = `${name}-${originalname}.webp`;
				const file = portfolioImageBucket.file(ref);
				// Create portfolio image instance
				await user.createUserContents({
					type: "portfolioImage",
					file_name: ref,
					public_url: file.publicUrl(),
					UserId: uid,
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
			});
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

		const user = await models.UserContent.findByPk(uid);

		if (videos?.length > 0) {
			const videos_obj = [];
			videos.forEach(async (video) => {
				const { path, originalname } = video;
				const name = req.user?.name || "Jason Mei";
				const ref = `tmp/${name}-${originalname}.mp4`;
				const fileName = ref.slice(4);
				const file = videoBucket.file(ref.slice(4));

				await user.createUserContents({
					type: "portfolioVideos",
					file_name: fileName,
					public_url: file.publicUrl(),
					UserId: uid,
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
			});
			req.videos = videos_obj;
			next();
		} else {
			next();
		}
	}
};

const getProfileDetails = async (req, res) => {
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

	return {
		uid,
		email,
		profileImage,
		portfolioImages,
		portfolioVideos,
		bio: user.bio,
	};
};

export {
	isLoggedIn,
	uploadProfileImage,
	uploadPortfolioImages,
	uploadVideos,
	getProfileDetails,
};
