const progressService = require("./progress.service");

// ==================================
// UPDATE LESSON PROGRESS
// ==================================

const updateLessonProgress = async (req, res, next) => {
    try {
        const progress = await progressService.updateLessonProgress(
            req.params.lessonId,
            req.user.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Lesson progress updated successfully",
            data: progress,
        });
    } catch (error) {
        next(error);
    }
};


// ==================================
// GET COURSE PROGRESS
// ==================================

const getCourseProgress = async (req, res, next) => {
    try {
        const progress = await progressService.getCourseProgress(
            req.params.courseId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Course progress fetched successfully",
            data: progress,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    updateLessonProgress,
    getCourseProgress,
};
