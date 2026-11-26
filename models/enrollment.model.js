
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Enrollment = sequelize.define(
    "Enrollment",
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

        courseId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM(
                "active",
                "completed",
                "cancelled"
            ),
            allowNull: false,
            defaultValue: "active",
        },

        enrolledAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

        completedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "enrollments",
        timestamps: true,
        underscored: true,

        indexes: [
            {
                unique: true,
                fields: ["user_id", "course_id"],
            },
        ],
    }
);

module.exports = Enrollment;