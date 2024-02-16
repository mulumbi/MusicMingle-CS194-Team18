const getUserModel = (sequelize, { DataTypes }) => {
	const User = sequelize.define("User", {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
		},
		bio: {
			type: DataTypes.TEXT,
			default: "",
		},
	});

	User.associate = (models) => {
		User.hasMany(models.UserContent);
	};

	return User;
};

export default getUserModel;
