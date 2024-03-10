"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUserContentModel = (sequelize, { DataTypes }) => {
    const UserContent = sequelize.define("UserContent", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        type: {
            type: DataTypes.ENUM("profileImage", "portfolioImage", "portfolioVideo", "gigImage", "gigProfileImage"),
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
        user_id: {
            type: DataTypes.UUID,
        },
        gig_id: {
            type: DataTypes.UUID,
        },
    });
    UserContent.associate = (models) => {
        UserContent.belongsTo(models.User, {
            foreignKey: "user_id",
            contraints: false,
        });
        UserContent.belongsTo(models.Gig, {
            foreignKey: "gig_id",
            contraints: false,
        });
    };
    return UserContent;
};
exports.default = getUserContentModel;
