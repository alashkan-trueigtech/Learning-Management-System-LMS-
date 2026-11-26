const courseService = require("./course.service");

// CREATE COURSE
const createCourse = async (req, res, next) => {
    try {
        const course = await courseService.createCourse(
            req.body,
            req.user
        );

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

// GET ALL COURSES
const getAllCourses = async (req, res, next) => {
    try {
        const result = await courseService.getAllCourses(
            req.query,
            req.user
        );

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: result.courses,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

// GET COURSE BY ID
const getCourseById = async (req, res, next) => {
    try {
        const course = await courseService.getCourseById(
            req.params.id,
            req.user
        );

        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            data: course,
        });
    } catch (error) {
        next(error);
    }
};


// UPDATE COURSE
const updateCourse = async (req, res, next) => {
    try {
        const course = await courseService.updateCourse(
            req.params.id,
            req.body,
            req.user
        );

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: course,
        });
    } catch (error) {
        next(error);
    }
};


// DELETE COURSE
const deleteCourse = async (req, res, next) => {
    try {
        await courseService.deleteCourse(
            req.params.id,
            req.user
        );

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};


// UPDATE COURSE STATUS
const updateCourseStatus = async (req, res, next) => {
    try {
        const course = await courseService.updateCourseStatus(
            req.params.id,
            req.body.status,
            req.user
        );

        return res.status(200).json({
            success: true,
            message: "Course status updated successfully",
            data: course,
        });
    } catch (error) {
        next(error);
    }
};


// ASSIGN INSTRUCTOR
const assignInstructor = async (req, res, next) => {
    try {
        const assignment = await courseService.assignInstructor(
            req.params.id,
            req.body.instructorId,
            req.body.isPrimary ?? false
        );

        return res.status(201).json({
            success: true,
            message: "Instructor assigned successfully",
            data: assignment,
        });
    } catch (error) {
        next(error);
    }
};


// REMOVE INSTRUCTOR
const removeInstructor = async (req, res, next) => {
    try {
        await courseService.removeInstructor(
            req.params.id,
            req.params.instructorId
        );

        return res.status(200).json({
            success: true,
            message: "Instructor removed successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    removeInstructor,
    assignInstructor,
    updateCourseStatus,
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
};
