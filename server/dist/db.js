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
exports.testDbConnection = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const UserContent_1 = __importDefault(require("./models/UserContent"));
const User_1 = __importDefault(require("./models/User"));
const Gig_1 = __importDefault(require("./models/Gig"));
const Application_1 = __importDefault(require("./models/Application"));
const sequelize = new sequelize_1.Sequelize("postgres", "postgres", "1234", {
    host: "db",
    port: 5432,
    dialect: "postgres",
});
exports.sequelize = sequelize;
const models = {
    User: (0, User_1.default)(sequelize, { DataTypes: sequelize_1.DataTypes }),
    UserContent: (0, UserContent_1.default)(sequelize, { DataTypes: sequelize_1.DataTypes }),
    Gig: (0, Gig_1.default)(sequelize, { DataTypes: sequelize_1.DataTypes }),
    Application: (0, Application_1.default)(sequelize, { DataTypes: sequelize_1.DataTypes }),
};
Object.keys(models).forEach((key) => {
    if ("associate" in models[key]) {
        models[key].associate(models);
    }
});
const testDbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        yield sequelize.query(`
			ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS tsvector_name tsvector GENERATED ALWAYS as (to_tsvector('english', coalesce(name, ''))) STORED;
			ALTER TABLE "Gigs" ADD COLUMN IF NOT EXISTS tsvector_name tsvector GENERATED ALWAYS as (to_tsvector('english', coalesce(name, ''))) STORED;
			ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS tsvector_organization tsvector GENERATED ALWAYS as (to_tsvector('english', coalesce(organization_name, ''))) STORED;
			CREATE INDEX IF NOT EXISTS GIGS_ROLE_TAGS_X ON "Gigs" USING GIN (gig_role_tags);
			CREATE INDEX IF NOT EXISTS GIGS_GENRE_TAGS_X ON "Gigs" USING GIN (gig_genre_tags);
			CREATE INDEX IF NOT EXISTS USER_GENRE_TAGS_X ON "Users" USING GIN (user_genre_tags);
			CREATE INDEX IF NOT EXISTS USER_ROLE_TAGS_X ON "Users" USING GIN (user_role_tags);
		`);
        console.log("Connection has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});
exports.testDbConnection = testDbConnection;
exports.default = models;
