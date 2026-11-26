
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Course = sequelize.define(
    "Course",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        slug: {
            type: DataTypes.STRING(180),
            allowNull: false,
            unique: true,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        thumbnail: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },

        level: {
            type: DataTypes.ENUM(
                "beginner",
                "intermediate",
                "advanced"
            ),
            defaultValue: "beginner",
        },

        status: {
            type: DataTypes.ENUM(
                "draft",
                "published",
                "archived"
            ),
            defaultValue: "draft",
        },
    },
    {
        tableName: "courses",
        timestamps: true,
        underscored: true,
    }
);

module.exports = Course;