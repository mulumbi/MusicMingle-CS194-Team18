const getUserContentModel = (sequelize, { DataTypes }) => {
	const UserContent = sequelize.define("UserContent", {
		type: {
			type: DataTypes.ENUM(
				"profileImage",
				"portfolioImage",
				"portfolioVideo"
			),
			allowNull: false,
		},
		file_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		public_url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

	UserContent.associate = (models) => {
		UserContent.belongsTo(models.User);
	};

	return UserContent;
};

export default getUserContentModel;
