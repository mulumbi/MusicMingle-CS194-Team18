import { Sequelize, DataTypes } from "sequelize";
import getUserContentModel from "./models/UserContent";
import getUserModel from "./models/User";

const sequelize = new Sequelize("postgres", "postgres", "1234", {
	host: "db",
	port: 5432,
	dialect: "postgres",
});

const models = {
	User: getUserModel(sequelize, { DataTypes }),
	UserContent: getUserContentModel(sequelize, { DataTypes }),
};

Object.keys(models).forEach((key) => {
	if ("associate" in models[key]) {
		models[key].associate(models);
	}
});

const testDbConnection = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

export { sequelize, testDbConnection };

export default models;
