
const express = require("express");
const router = express.Router();

const userController = require("./user.controller");
const { createInstructorSchema } = require("./user.schema");

const { authenticate } = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

// Get all users (Admin only)
router.get(
    "/",
    authenticate,
    authorizeRoles("admin"),
    userController.getAllUsers
);

// Create instructor (Admin only)
router.post(
    "/instructors",
    authenticate,
    authorizeRoles("admin"),
    validate(createInstructorSchema),
    userController.createInstructor
);

module.exports = router;

