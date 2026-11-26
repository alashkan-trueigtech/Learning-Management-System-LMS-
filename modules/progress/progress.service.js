const sequelize = require("../../config/database");
const { Op } = require("sequelize");

const {
    Course,
    Lesson,
    Enrollment,
    LessonProgress,
} = require("../../models");

const AppError = require("../../errors/AppError");

// ==================================
// UPDATE LESSON PROGRESS
// ==================================

const updateLessonProgress = async (lessonId, userId, progressData) => {
    return await sequelize.transaction(async (transaction) => {

        // Find lesson
        const lesson = await Lesson.findByPk(lessonId, {
            transaction,
        });

        if (!lesson || !lesson.isPublished) {
            throw new AppError("Lesson not found", 404);
        }

        // Check course
        const course = await Course.findByPk(lesson.courseId, {
            transaction,
        });

        if (!course || course.status !== "published") {
            throw new AppError("Course not found", 404);
        }

        // Check active enrollment
        const enrollment = await Enrollment.findOne({
            where: {
                userId,
                courseId: lesson.courseId,
                status: "active",
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!enrollment) {
            throw new AppError(
                "Active course enrollment required",
                403
            );
        }

        // Find existing progress
        let progress = await LessonProgress.findOne({
            where: {
                userId,
                lessonId,
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        const updateData = {};

        if (progressData.lastPositionSeconds !== undefined) {
            updateData.lastPositionSeconds =
                progressData.lastPositionSeconds;
        }

        if (progressData.isCompleted !== undefined) {
            updateData.isCompleted = progressData.isCompleted;

            if (progressData.isCompleted) {
                updateData.completedAt =
                    progress && progress.isCompleted
                        ? progress.completedAt
                        : new Date();
            } else {
                updateData.completedAt = null;
            }
        }

        if (progress) {
            await progress.update(updateData, { transaction });
        } else {
            progress = await LessonProgress.create(
                {
                    userId,
                    lessonId,
                    ...updateData,
                },
                { transaction }
            );
        }

                // Check whether all published lessons are completed
        const publishedLessons = await Lesson.findAll({
            where: {
                courseId: lesson.courseId,
                isPublished: true,
            },
            attributes: ["id"],
            transaction,
        });

        const lessonIds = publishedLessons.map(
            (item) => item.id
        );

        const completedLessons = await LessonProgress.count({
            where: {
                userId,
                lessonId: {
                    [Op.in]: lessonIds,
                },
                isCompleted: true,
            },
            transaction,
        });

        // Automatically complete enrollment
        if (
            lessonIds.length > 0 &&
            completedLessons === lessonIds.length
        ) {
            await enrollment.update(
                {
                    status: "completed",
                    completedAt: new Date(),
                },
                { transaction }
            );
        }

        return progress;
    });
};


// ==================================
// GET COURSE PROGRESS
// ==================================

const getCourseProgress = async (courseId, userId) => {

    const course = await Course.findByPk(courseId);

    if (!course || course.status !== "published") {
        throw new AppError("Course not found", 404);
    }

    // Check active or completed enrollment
    const enrollment = await Enrollment.findOne({
        where: {
            userId,
            courseId,
            status: ["active", "completed"],
        },
    });

    if (!enrollment) {
        throw new AppError(
            "Course enrollment required to view progress",
            403
        );
    }

    // Get published lessons
    const lessons = await Lesson.findAll({
        where: {
            courseId,
            isPublished: true,
        },
        attributes: ["id", "title", "position"],
        order: [["position", "ASC"]],
    });

    const lessonIds = lessons.map((lesson) => lesson.id);

    // Get student's completed progress
    const completedProgress = await LessonProgress.findAll({
        where: {
            userId,
            lessonId: lessonIds,
            isCompleted: true,
        },
    });

    const totalLessons = lessons.length;
    const completedLessons = completedProgress.length;

    const percentage = totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100);

    return {
        courseId,
        courseTitle: course.title,
        totalLessons,
        completedLessons,
        remainingLessons: totalLessons - completedLessons,
        completionPercentage: percentage,
        lessons,
    };
};


module.exports = {
    updateLessonProgress,
    getCourseProgress,
};
