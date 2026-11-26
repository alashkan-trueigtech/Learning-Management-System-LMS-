
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CourseInstructor = sequelize.define(
    "CourseInstructor",
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

        instructorId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        isPrimary: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "course_instructors",
        timestamps: true,
        underscored: true,

        indexes: [
            {
                unique: true,
                fields: ["course_id", "instructor_id"],
            },
        ],
    }
);

module.exports = CourseInstructor;