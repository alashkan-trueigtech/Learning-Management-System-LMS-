const express = require("express");
const router = express.Router();

const enrollmentController = require("./enrollment.controller");

const { authenticate } = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    createEnrollmentSchema,
} = require("./enrollment.schema");

// ==================================
// CREATE ENROLLMENT
// ==================================

router.post(
    "/",
    authenticate,
    authorizeRoles("student"),
    validate(createEnrollmentSchema),
    enrollmentController.createEnrollment
);

// ==================================
// GET MY ENROLLMENTS
// ==================================

router.get(
    "/my-enrollments",
    authenticate,
    authorizeRoles("student"),
    enrollmentController.getMyEnrollments
);

// ==================================
// CANCEL ENROLLMENT
// ==================================

router.patch(
    "/:enrollmentId/cancel",
    authenticate,
    authorizeRoles("student"),
    enrollmentController.cancelEnrollment
);

module.exports = router;

