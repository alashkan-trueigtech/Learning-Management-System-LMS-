const express = require("express");
const router = express.Router();

const progressController = require("./progress.controller");

const { authenticate } = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    updateProgressSchema,
} = require("./progress.schema");

// UPDATE LESSON PROGRESS
router.patch(
    "/lessons/:lessonId",
    authenticate,
    authorizeRoles("student"),
    validate(updateProgressSchema),
    progressController.updateLessonProgress
);

// GET COURSE PROGRESS
router.get(
    "/courses/:courseId",
    authenticate,
    authorizeRoles("student"),
    progressController.getCourseProgress
);

module.exports = router;
