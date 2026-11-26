const lessonService = require("./lesson.service");

// CREATE LESSON
const createLesson = async (req, res, next) => {
    try {
        const lesson = await lessonService.createLesson(
            req.params.courseId,
            req.body,
            req.user
        );

        res.status(201).json({
            success: true,
            message: "Lesson created successfully",
            data: lesson,
        });
    } catch (error) {
        next(error);
    }
};


// GET ALL LESSONS
const getAllLessons = async (req, res, next) => {
    try {
        const lessons = await lessonService.getAllLessons(
            req.params.courseId,
            req.user
        );

        res.status(200).json({
            success: true,
            data: lessons,
        });
    } catch (error) {
        next(error);
    }
};


// GET LESSON BY ID
const getLessonById = async (req, res, next) => {
    try {
        const lesson = await lessonService.getLessonById(
            req.params.courseId,
            req.params.lessonId,
            req.user
        );

        res.status(200).json({
            success: true,
            data: lesson,
        });
    } catch (error) {
        next(error);
    }
};


// UPDATE LESSON
const updateLesson = async (req, res, next) => {
    try {
        const lesson = await lessonService.updateLesson(
            req.params.courseId,
            req.params.lessonId,
            req.body,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Lesson updated successfully",
            data: lesson,
        });
    } catch (error) {
        next(error);
    }
};


// DELETE LESSON
const deleteLesson = async (req, res, next) => {
    try {
        await lessonService.deleteLesson(
            req.params.courseId,
            req.params.lessonId,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Lesson deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createLesson,
    getAllLessons,
    getLessonById,
    updateLesson,
    deleteLesson,
};
