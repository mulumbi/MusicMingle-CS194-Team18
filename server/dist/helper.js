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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFields = exports.searchArtists = exports.formatDateTime = exports.uploadGigImages = exports.searchGigs = exports.getGigDetails = exports.getProfileDetails = exports.uploadVideos = exports.uploadPortfolioImages = exports.uploadProfileImage = exports.isLoggedIn = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const auth_1 = require("firebase-admin/auth");
const sharp_1 = __importDefault(require("sharp"));
const storage_1 = require("@google-cloud/storage");
const fs_1 = __importDefault(require("fs"));
const db_1 = __importDefault(require("./db"));
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const bucketStorage = new storage_1.Storage({
    keyFilename: `/usr/src/app/config/musicmingle-847509563d60.json`,
});
const profileBucket = bucketStorage.bucket("music-mingle-profile");
const videoBucket = bucketStorage.bucket("music-mingle-video");
const portfolioImageBucket = bucketStorage.bucket("music-mingle-portfolio-bucket");
const gigImageBucket = bucketStorage.bucket("music-mingle-gig-bucket");
const parseFields = (req, res, next) => {
    console.log(req.body, "Body");
    const { user_genre_tags, user_role_tags, organization_group_size, estimate_flat_rate, is_artist, gig_role_tags, gig_genre_tags, event_end, event_start, } = req.body;
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
exports.parseFields = parseFields;
// middleware for checking if user is logged in. allows the extraction of name, uid, email, etc from req.user anywhere
const isLoggedIn = (req, res, next) => {
    var _a, _b;
    const token = req.headers.authorization || ((_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.authorization);
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    (0, auth_1.getAuth)()
        .verifyIdToken(token)
        .then((decodedToken) => {
        req.user = decodedToken;
        const { uid, email, name, picture } = decodedToken;
        db_1.default.User.findOne({ where: { uuid: uid } })
            .then((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (!user) {
                const newUser = yield db_1.default.User.create({
                    uuid: uid,
                    name: name,
                    email: email,
                    bio: "",
                    user_genre_tags: [],
                    user_role_tags: [],
                    organization_name: "",
                    organization_group_size: 1,
                });
                const newUserContent = yield newUser.createUserContent({
                    type: "profileImage",
                    file_name: name + "-Profile.webp",
                    public_url: picture,
                });
                yield newUserContent.save();
                next();
                //console.log(await newUserContent.getUser());
            }
            else {
                next();
            }
        }))
            .catch((err) => console.log("Find by pk error: ", err));
    })
        .catch((err) => {
        console.log("Error verifying token:", err);
        res.status(401).json({ error: "Unauthorized" });
    });
};
exports.isLoggedIn = isLoggedIn;
// Optimizes profile image for upload, create profile image instance in db, upload image to google cloud storage
const uploadProfileImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.files, "Files");
    if (!req.files || !req.files.profile_image) {
        next();
    }
    else {
        const { profile_image } = req.files;
        const { name, uid } = req.user;
        console.log(profile_image, "Profile Image");
        if ((profile_image === null || profile_image === void 0 ? void 0 : profile_image.length) === 1) {
            // Delete old image from db
            const user = yield db_1.default.User.findOne({
                where: { uuid: uid },
            });
            const old_image = yield user.getUserContents({
                where: { type: "profileImage" },
            });
            if (old_image.length > 0) {
                yield old_image[0].destroy();
            }
            const ref = `${name}-${profile_image[0].filename}-profile.webp`;
            const file = profileBucket.file(ref);
            const new_image = yield user.createUserContent({
                type: "profileImage",
                file_name: ref,
                public_url: file.publicUrl(),
            });
            yield new_image.save();
            (0, sharp_1.default)(profile_image[0].path)
                .webp({ quality: 70 })
                .toBuffer()
                .then((data) => {
                file.save(data)
                    .then(() => {
                    fs_1.default.unlink(profile_image[0].path, (err) => {
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
        }
        else {
            next();
        }
    }
});
exports.uploadProfileImage = uploadProfileImage;
// Optimizes images for upload, uploads images to google cloud storage for public url, creates portfolio image instances in db
const uploadPortfolioImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || !req.files.portfolio_images) {
        next();
    }
    else {
        const { portfolio_images } = req.files;
        const { uid, name, email } = req.user;
        const user = yield db_1.default.User.findOne({ where: { uuid: uid } });
        if ((portfolio_images === null || portfolio_images === void 0 ? void 0 : portfolio_images.length) > 0) {
            const portfolio_images_obj = [];
            portfolio_images.forEach((image) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const { path, originalname } = image;
                const name = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.name) || "Jason Mei";
                const ref = `${name}-${originalname}.webp`;
                const file = portfolioImageBucket.file(ref);
                // Create portfolio image instance
                const user_content = yield user.createUserContent({
                    type: "portfolioImage",
                    file_name: ref,
                    public_url: file.publicUrl(),
                    // UserId: uid,
                });
                // Optimize image, upload to google cloud storage, make image public
                (0, sharp_1.default)(path)
                    .webp({ quality: 70 })
                    .toBuffer()
                    .then((data) => {
                    file.save(data)
                        .then(() => {
                        fs_1.default.unlink(path, (err) => {
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
            }));
            yield Promise.allSettled(portfolio_images_obj);
            req.portfolio_images = portfolio_images_obj;
            next();
        }
        else {
            next();
        }
    }
});
exports.uploadPortfolioImages = uploadPortfolioImages;
// Optimizes videos for upload, uploads videos to google cloud storage for public url, creates portfolio videos instances in db
const uploadVideos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || !req.files.videos) {
        next();
    }
    else {
        const { videos } = req.files;
        const { uid } = req.user;
        const user = yield db_1.default.User.findOne({ where: { uuid: uid } });
        console.log(videos, "videos");
        if ((videos === null || videos === void 0 ? void 0 : videos.length) > 0) {
            const videoUploadPromises = videos.map((video) => __awaiter(void 0, void 0, void 0, function* () {
                var _b;
                const { path, originalname } = video;
                const name = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.name) || "Jason Mei";
                const ref = `tmp/${name}-${originalname}.mp4`;
                const fileName = ref.slice(4);
                const file = videoBucket.file(ref.slice(4));
                const user_content = yield user.createUserContent({
                    type: "portfolioVideo",
                    file_name: fileName,
                    public_url: file.publicUrl(),
                });
                yield new Promise((resolve, reject) => {
                    (0, fluent_ffmpeg_1.default)()
                        .input(path)
                        .format("mp4")
                        .fps(30)
                        .addOptions(["-crf 28"])
                        .save(ref)
                        .on("error", reject)
                        .on("end", () => {
                        fs_1.default.unlink(path, (err) => {
                            if (err)
                                console.log("// Error when deleting temp file", err);
                        });
                        fs_1.default.createReadStream(ref)
                            .pipe(file.createWriteStream())
                            .on("error", reject)
                            .on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
                            yield file.makePublic();
                            fs_1.default.unlink(ref, (err) => {
                                if (err)
                                    console.log("Video unlink err:", err);
                            });
                            resolve(true); // Resolve after file is public
                        }));
                    });
                });
                return user_content;
            }));
            Promise.all(videoUploadPromises)
                .then(() => {
                fs_1.default.readdir("tmp", (err, files) => {
                    if (err) {
                        // Handle errors, such as the folder not existing
                        console.error("Error reading folder:", err);
                    }
                    else {
                        if (files.length > 0) {
                            files.forEach((file) => {
                                const filePath = path_1.default.join("tmp", file);
                                fs_1.default.unlink(filePath, (err) => {
                                    if (err) {
                                        console.error("Error deleting file:", err);
                                    }
                                    else {
                                        console.log("Deleted file:", filePath);
                                    }
                                });
                            });
                        }
                        else {
                            // Folder is already empty
                            console.log("Folder is empty.");
                        }
                    }
                });
            })
                .finally(() => {
                next();
            });
        }
        else {
            next();
        }
    }
});
exports.uploadVideos = uploadVideos;
const getGigDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gig_id } = req;
    const gig = yield db_1.default.Gig.findByPk(gig_id);
    return gig;
});
exports.getGigDetails = getGigDetails;
const uploadGigImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || (!req.files.gig_images && !req.files.gig_profile_image)) {
        next();
    }
    else {
        const { gig_images, gig_profile_image } = req.files;
        if ((gig_images === null || gig_images === void 0 ? void 0 : gig_images.length) > 0) {
            const gigImages = [];
            gig_images.forEach((image) => __awaiter(void 0, void 0, void 0, function* () {
                const { path, originalname } = image;
                const ref = `${(0, uuid_1.v4)()}-${originalname}.webp`;
                const file = gigImageBucket.file(ref);
                // Optimize image, upload to google cloud storage, make image public
                (0, sharp_1.default)(path)
                    .webp({ quality: 70 })
                    .toBuffer()
                    .then((data) => {
                    file.save(data)
                        .then(() => {
                        fs_1.default.unlink(path, (err) => {
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
            }));
            yield Promise.allSettled(gigImages);
            req.gig_images = gigImages;
        }
        const gigProfileImage = {};
        if (gig_profile_image.length > 0) {
            gig_profile_image.forEach((image) => {
                const { path, originalname } = image;
                const ref = `${(0, uuid_1.v4)()}-${originalname}.webp`;
                const file = gigImageBucket.file(ref);
                // Optimize image, upload to google cloud storage, make image public
                (0, sharp_1.default)(path)
                    .webp({ quality: 70 })
                    .toBuffer()
                    .then((data) => {
                    file.save(data)
                        .then(() => {
                        fs_1.default.unlink(path, (err) => {
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
});
exports.uploadGigImages = uploadGigImages;
const tagParser = (tags) => {
    if (!tags)
        return [];
    return JSON.parse(tags)
        .map((tag) => `'${tag}'`)
        .join(", ");
};
const searchArtists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_role_tags, user_genre_tags, name, flat_rate_start, flat_rate_end, organization_name, organization_size_start, organization_size_end, limit, offset, artist_id, } = req.query;
    if (artist_id) {
        const user = yield db_1.default.User.findOne({
            where: { is_artist: true, id: artist_id },
        });
        const profileImage = yield user.getUserContents({
            where: { type: "profileImage" },
        });
        const portfolioImages = yield user.getUserContents({
            where: { type: "portfolioImage" },
        });
        const portfolioVideos = yield user.getUserContents({
            where: { type: "portfolioVideo" },
        });
        return Object.assign(Object.assign({}, user.dataValues), { profileImage,
            portfolioImages,
            portfolioVideos });
    }
    const query = [{ is_artist: true }];
    if (organization_size_start) {
        query.push({
            organization_group_size: { [sequelize_1.Op.gte]: organization_size_start },
        });
    }
    if (organization_size_end) {
        query.push({
            organization_group_size: { [sequelize_1.Op.lte]: organization_size_end },
        });
    }
    if (flat_rate_start) {
        query.push({
            estimate_flat_rate: { [sequelize_1.Op.gte]: parseInt(flat_rate_start) },
        });
    }
    if (flat_rate_end) {
        query.push({
            estimate_flat_rate: { [sequelize_1.Op.lte]: parseInt(flat_rate_end) },
        });
    }
    if (name) {
        query.push({
            [sequelize_1.Op.or]: [
                {
                    name: sequelize_1.Sequelize.literal(`tsvector_name @@ to_tsquery('${name}:* ')`),
                },
                {
                    name: sequelize_1.Sequelize.literal(`tsvector_organization @@ to_tsquery('${organization_name}:* ')`),
                },
            ],
        });
    }
    const parsed_user_role_tags = tagParser(user_role_tags);
    query.push({
        user_role_tags: sequelize_1.Sequelize.literal(`ARRAY[${parsed_user_role_tags}]::varchar[] <@ user_role_tags`),
    });
    const parsed_user_genre_tags = tagParser(user_genre_tags);
    query.push({
        user_genre_tags: sequelize_1.Sequelize.literal(`ARRAY[${parsed_user_genre_tags}]::varchar[] <@ user_genre_tags`),
    });
    console.log(query, "Query");
    const users = yield db_1.default.User.findAll({
        where: {
            [sequelize_1.Op.and]: query,
        },
        order: [["name", "DESC"]],
        limit: limit ? limit : 10,
        offset: offset ? offset : 0,
    });
    const formattedUsers = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
        const userModel = yield db_1.default.User.findOne({
            where: { id: user.id },
        });
        const profileImage = yield userModel.getUserContents({
            where: { type: "profileImage" },
        });
        return Object.assign(Object.assign({}, user.dataValues), { profileImage });
    })));
    return formattedUsers;
});
exports.searchArtists = searchArtists;
const searchGigs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { event_start, event_end, gig_role_tags, gig_genre_tags, name, flat_rate_start, flat_rate_end, limit, offset, gig_id, } = req.query;
    if (gig_id) {
        return yield db_1.default.Gig.findByPk(gig_id);
    }
    const query = [{ is_open: true }];
    if (event_start) {
        query.push({ event_start: { [sequelize_1.Op.gte]: event_start } });
    }
    if (event_end) {
        query.push({ event_end: { [sequelize_1.Op.lte]: event_end } });
    }
    if (flat_rate_start) {
        query.push({
            estimate_flat_rate: { [sequelize_1.Op.gte]: parseInt(flat_rate_start) },
        });
    }
    if (flat_rate_end) {
        query.push({
            estimate_flat_rate: { [sequelize_1.Op.lte]: parseInt(flat_rate_end) },
        });
    }
    if (name) {
        query.push({
            name: sequelize_1.Sequelize.literal(`tsvector_name @@ to_tsquery('${name}:*')`),
        });
    }
    if ((gig_role_tags === null || gig_role_tags === void 0 ? void 0 : gig_role_tags.length) > 0) {
        const tags = JSON.parse(gig_role_tags)
            .map((tag) => `'${tag}'`)
            .join(", ");
        query.push({
            gig_role_tags: sequelize_1.Sequelize.literal(`ARRAY[${tags}]::varchar[] <@ gig_role_tags`),
        });
    }
    if ((gig_genre_tags === null || gig_genre_tags === void 0 ? void 0 : gig_genre_tags.length) > 0) {
        const tags = JSON.parse(gig_genre_tags)
            .map((tag) => `'${tag}'`)
            .join(", ");
        query.push({
            gig_genre_tags: sequelize_1.Sequelize.literal(`ARRAY[${tags}]::varchar[] <@ gig_genre_tags`),
        });
    }
    console.log(query, "Query");
    const gigs = yield db_1.default.Gig.findAll({
        where: {
            [sequelize_1.Op.and]: query,
        },
        order: [["name", "DESC"]],
        limit: limit ? limit : 10,
        offset: offset ? offset : 0,
    });
    const formattedGigs = yield Promise.all(gigs.map((gig) => __awaiter(void 0, void 0, void 0, function* () {
        const content = yield gig.getGigImages();
        const gigData = __rest(gig.dataValues, []);
        const values = Object.assign(Object.assign({}, gigData), { gigImages: content
                .filter((image) => image.type === "gigImage")
                .map((image) => image.dataValues), gigProfileImage: content.find((image) => image.type === "gigProfileImage") });
        return values;
    })));
    console.log(formattedGigs, "Gigs");
    return formattedGigs;
});
exports.searchGigs = searchGigs;
const getProfileDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid, email } = req.user;
    const user = yield db_1.default.User.findOne({ where: { uuid: uid } });
    const profileImage = yield user.getUserContents({
        where: { type: "profileImage" },
    });
    const portfolioImages = yield user.getUserContents({
        where: { type: "portfolioImage" },
    });
    const portfolioVideos = yield user.getUserContents({
        where: { type: "portfolioVideo" },
    });
    const _c = user.dataValues, { id } = _c, data = __rest(_c, ["id"]);
    return Object.assign(Object.assign({}, data), { profileImage,
        portfolioImages,
        portfolioVideos });
});
exports.getProfileDetails = getProfileDetails;
const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const isoString = date.toISOString();
    const isoDate = isoString.slice(0, 10); // YYYY-MM-DD
    const isoTime = isoString.slice(11, 23); // HH:MM:SS.MS
    const postgresTimestamp = `${isoDate} ${isoTime}`;
    return postgresTimestamp; //YYYY-MM-DD HH:MM:SS.MS
};
exports.formatDateTime = formatDateTime;
