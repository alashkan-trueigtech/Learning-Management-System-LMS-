const sequelize = require("../../config/database");

const {
    Course,
    Enrollment,
    Category,
} = require("../../models");

const AppError = require("../../errors/AppError");


// ==================================
// CREATE ENROLLMENT
// ==================================

const createEnrollment = async (courseId, userId) => {
    try {
        return await sequelize.transaction(async (transaction) => {

            // Check whether course exists
            const course = await Course.findByPk(courseId, {
                transaction,
            });

            if (!course) {
                throw new AppError("Course not found", 404);
            }

            // Only published courses can be enrolled
            if (course.status !== "published") {
                throw new AppError(
                    "This course is not available for enrollment",
                    400
                );
            }

            // Check existing enrollment
            const existingEnrollment = await Enrollment.findOne({
                where: {
                    courseId,
                    userId,
                },
                transaction,
                lock: transaction.LOCK.UPDATE,
            });

            if (existingEnrollment) {
                if (existingEnrollment.status !== "cancelled") {
                    throw new AppError(
                        "You are already enrolled in this course",
                        409
                    );
                }

                // Reactivate cancelled enrollment
                existingEnrollment.status = "active";
                existingEnrollment.enrolledAt = new Date();
                existingEnrollment.completedAt = null;

                await existingEnrollment.save({ transaction });

                return existingEnrollment;
            }

            // Create new enrollment
            const enrollment = await Enrollment.create(
                {
                    courseId,
                    userId,
                    status: "active",
                },
                { transaction }
            );

            return enrollment;
        });

    } catch (error) {
        // Handle duplicate enrollment from unique database index
        if (error.name === "SequelizeUniqueConstraintError") {
            throw new AppError(
                "You are already enrolled in this course",
                409
            );
        }

        throw error;
    }
};


// ==================================
// GET MY ENROLLMENTS
// ==================================

const getMyEnrollments = async (userId, query = {}) => {

    const page = Math.max(Number(query.page) || 1, 1);

    const limit = Math.min(
        Math.max(Number(query.limit) || 10, 1),
        100
    );

    const offset = (page - 1) * limit;

    const where = { userId };

    // Validate enrollment status
    if (query.status) {
        const allowedStatuses = [
            "active",
            "completed",
            "cancelled",
        ];

        if (!allowedStatuses.includes(query.status)) {
            throw new AppError(
                "Invalid enrollment status",
                400
            );
        }

        where.status = query.status;
    }

    const { count, rows } = await Enrollment.findAndCountAll({
        where,

        include: [
            {
                model: Course,
                as: "course",

                attributes: [
                    "id",
                    "title",
                    "slug",
                    "thumbnail",
                    "price",
                    "level",
                    "status",
                ],

                include: [
                    {
                        model: Category,
                        as: "category",

                        attributes: [
                            "id",
                            "name",
                            "slug",
                        ],
                    },
                ],
            },
        ],

        limit,
        offset,

        order: [["enrolledAt", "DESC"]],

        distinct: true,
    });

    return {
        enrollments: rows,

        pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        },
    };
};


// ==================================
// CANCEL ENROLLMENT
// ==================================

const cancelEnrollment = async (enrollmentId, userId) => {

    return await sequelize.transaction(async (transaction) => {

        const enrollment = await Enrollment.findOne({
            where: {
                id: enrollmentId,
                userId,
            },

            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!enrollment) {
            throw new AppError("Enrollment not found", 404);
        }

        if (enrollment.status === "cancelled") {
            throw new AppError(
                "Enrollment is already cancelled",
                400
            );
        }

        if (enrollment.status === "completed") {
            throw new AppError(
                "Completed enrollment cannot be cancelled",
                400
            );
        }

        enrollment.status = "cancelled";

        await enrollment.save({ transaction });

        return enrollment;
    });
};


module.exports = {
    createEnrollment,
    getMyEnrollments,
    cancelEnrollment,
};
