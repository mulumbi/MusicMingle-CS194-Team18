import { Sequelize, DataTypes } from "sequelize";
import getUserContentModel from "./models/UserContent";
import getUserModel from "./models/User";
import getGigModel from "./models/Gig";
import getApplicationModel from "./models/Application";

const sequelize = new Sequelize("postgres", "postgres", "1234", {
	host: "db",
	port: 5432,
	dialect: "postgres",
});

const models = {
	User: getUserModel(sequelize, { DataTypes }),
	UserContent: getUserContentModel(sequelize, { DataTypes }),
	Gig: getGigModel(sequelize, { DataTypes }),
	Application: getApplicationModel(sequelize, { DataTypes }),
};

Object.keys(models).forEach((key) => {
	if ("associate" in models[key]) {
		models[key].associate(models);
	}
});

const testDbConnection = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.query(`
			ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS tsvector_name tsvector GENERATED ALWAYS as (to_tsvector('english', coalesce(name, ''))) STORED;
			ALTER TABLE "Gigs" ADD COLUMN IF NOT EXISTS tsvector_name tsvector GENERATED ALWAYS as (to_tsvector('english', coalesce(name, ''))) STORED;
			ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS tsvector_organization tsvector GENERATED ALWAYS as (to_tsvector('english', coalesce(organization_name, ''))) STORED;
			CREATE INDEX IF NOT EXISTS GIGS_TAGS_X ON "Gigs" USING GIN (gig_tags);
			CREATE INDEX IF NOT EXISTS USER_GENRE_TAGS_X ON "Users" USING GIN (user_genre_tags);
			CREATE INDEX IF NOT EXISTS USER_ROLE_TAGS_X ON "Users" USING GIN (user_role_tags);
		`);
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

export { sequelize, testDbConnection };

export default models;
