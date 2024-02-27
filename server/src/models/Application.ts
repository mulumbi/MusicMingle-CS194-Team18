const getApplicationModel = (sequelize, { DataTypes }) => {
	const Application = sequelize.define("Application", {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		userId: {
			type: DataTypes.UUID,
			references: {
				model: "Users",
				key: "id",
			},
		},
		gigId: {
			type: DataTypes.UUID,
			references: {
				model: "Gigs",
				key: "id",
			},
		},
	});

	Application.associate = (models) => {
		Application.belongsTo(models.User, {
			foreignKey: "userId",
			contraints: false,
		});
		Application.belongsTo(models.Gig, {
			foreignKey: "gigId",
			contraints: false,
		});
	};

	return Application;
};

export default getApplicationModel;
