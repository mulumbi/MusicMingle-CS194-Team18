const getUserModel = (sequelize, { DataTypes }) => {
	const User = sequelize.define("User", {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		uuid: {
			type: DataTypes.STRING,
			unique: true,
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
			defaultValue: "",
		},
		user_genre_tags: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			defaultValue: [],
		},
		user_role_tags: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			defaultValue: [],
		},
		organization_name: {
			type: DataTypes.TEXT,
			defaultValue: "",
		},
		organization_group_size: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		estimate_flat_rate: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		is_artist: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	});

	User.associate = (models) => {
		User.hasMany(models.UserContent, {
			foreignKey: "user_id",
			contraints: false,
		});
		User.hasMany(models.Gig);
		User.hasMany(models.Application, {
			foreignKey: "userId",
			contraints: false,
		});
	};

	return User;
};

export default getUserModel;
