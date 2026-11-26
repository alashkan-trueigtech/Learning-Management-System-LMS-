const express = require("express");
const router = express.Router();

const lessonController = require("./lesson.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    createLessonSchema,
    updateLessonSchema,
} = require("./lesson.schema");


// CREATE LESSON
router.post(
    "/courses/:courseId/lessons",
    authenticate,
    authorizeRoles("admin", "instructor"),
    validate(createLessonSchema),
    lessonController.createLesson
);


// GET ALL LESSONS
router.get(
    "/courses/:courseId/lessons",
    authenticate,
    lessonController.getAllLessons
);


// GET LESSON BY ID
router.get(
    "/courses/:courseId/lessons/:lessonId",
    authenticate,
    lessonController.getLessonById
);


// UPDATE LESSON
router.patch(
    "/courses/:courseId/lessons/:lessonId",
    authenticate,
    authorizeRoles("admin", "instructor"),
    validate(updateLessonSchema),
    lessonController.updateLesson
);


// DELETE LESSON
router.delete(
    "/courses/:courseId/lessons/:lessonId",
    authenticate,
    authorizeRoles("admin", "instructor"),
    lessonController.deleteLesson
);


module.exports = router;
