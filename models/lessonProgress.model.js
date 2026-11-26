
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LessonProgress = sequelize.define(
    "LessonProgress",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        lessonId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        isCompleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        lastPositionSeconds: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        tableName: "lesson_progress",
        timestamps: true,
        underscored: true,

        indexes: [
            {
                unique: true,
                fields: ["user_id", "lesson_id"],
            },
        ],
    }
);

module.exports = LessonProgress;