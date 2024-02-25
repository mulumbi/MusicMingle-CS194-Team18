const getGigModel = (sequelize, { DataTypes }) => {
	const Gig = sequelize.define("Gig", {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		estimate_flat_rate: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		name: {
			type: DataTypes.STRING,
		},
		bio: {
			type: DataTypes.TEXT,
			defaultValue: "",
		},
		event_start: {
			type: DataTypes.DATE,
		},
		event_end: {
			type: DataTypes.DATE,
		},
		gig_tags: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			defaultValue: [],
		},
	});

	Gig.associate = (models) => {
		Gig.belongsTo(models.User);
		Gig.hasMany(models.UserContent, {
			foreignKey: "gig_id",
			contraints: false,
		});
	};

	return Gig;
};

export default getGigModel;
