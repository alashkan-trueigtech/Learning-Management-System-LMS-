
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Lesson = sequelize.define(
    "Lesson",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        courseId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        contentType: {
            type: DataTypes.ENUM(
                "video",
                "article",
                "document"
            ),
            allowNull: false,
            defaultValue: "video",
        },

        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        videoUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },

        durationMinutes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        isPreview: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        isPublished: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "lessons",
        timestamps: true,
        underscored: true,
    }
);

module.exports = Lesson;