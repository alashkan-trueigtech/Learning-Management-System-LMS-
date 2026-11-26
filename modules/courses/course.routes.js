const express = require("express");
const router = express.Router();

const courseController = require("./course.controller");

const { authenticate } = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    createCourseSchema,
    updateCourseSchema,
    updateCourseStatusSchema,
    assignInstructorSchema,
} = require("./course.schema");

// CREATE COURSE (Admin and Instructor)
router.post(
    "/",
    authenticate,
    authorizeRoles("admin", "instructor"),
    validate(createCourseSchema),
    courseController.createCourse
);

// GET ALL COURSES
router.get(
    "/",
    authenticate,
    courseController.getAllCourses
);

// GET COURSE BY ID
router.get(
    "/:id",
    authenticate,
    courseController.getCourseById
);




// ASSIGN INSTRUCTOR TO COURSE (Admin Only)
router.post(
    "/:id/instructors",
    authenticate,
    authorizeRoles("admin"),
    validate(assignInstructorSchema),
    courseController.assignInstructor
);


// REMOVE INSTRUCTOR FROM COURSE (Admin Only)
router.delete(
    "/:id/instructors/:instructorId",
    authenticate,
    authorizeRoles("admin"),
    courseController.removeInstructor
);

// PUBLISH / ARCHIVE COURSE
router.patch(
    "/:id/status",
    authenticate,
    authorizeRoles("admin", "instructor"),
    validate(updateCourseStatusSchema),
    courseController.updateCourseStatus
);

// UPDATE COURSE (Admin and Assigned Instructor)
router.patch(
    "/:id",
    authenticate,
    authorizeRoles("admin", "instructor"),
    validate(updateCourseSchema),
    courseController.updateCourse
);


// DELETE COURSE (Admin and Assigned Instructor)
router.delete(
    "/:id",
    authenticate,
    authorizeRoles("admin", "instructor"),
    courseController.deleteCourse
);

module.exports = router;
