const enrollmentService = require("./enrollment.service");

// ==================================
// CREATE ENROLLMENT
// ==================================

const createEnrollment = async (req, res, next) => {
    try {
        const enrollment = await enrollmentService.createEnrollment(
            req.body.courseId,
            req.user.id
        );

        res.status(201).json({
            success: true,
            message: "Successfully enrolled in course",
            data: enrollment,
        });
    } catch (error) {
        next(error);
    }
};


// ==================================
// GET MY ENROLLMENTS
// ==================================

const getMyEnrollments = async (req, res, next) => {
    try {
        const result = await enrollmentService.getMyEnrollments(
            req.user.id,
            req.query
        );

        res.status(200).json({
            success: true,
            message: "Enrollments fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


// ==================================
// CANCEL ENROLLMENT
// ==================================

const cancelEnrollment = async (req, res, next) => {
    try {
        const enrollment = await enrollmentService.cancelEnrollment(
            req.params.enrollmentId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Enrollment cancelled successfully",
            data: enrollment,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createEnrollment,
    getMyEnrollments,
    cancelEnrollment,
};
