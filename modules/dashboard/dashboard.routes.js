
const express = require("express");
const router = express.Router();

const dashboardController = require("./dashboard.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");

// ADMIN DASHBOARD
router.get(
    "/admin",
    authenticate,
    authorizeRoles("admin"),
    dashboardController.getAdminDashboard
);

// INSTRUCTOR DASHBOARD
router.get(
    "/instructor",
    authenticate,
    authorizeRoles("instructor"),
    dashboardController.getInstructorDashboard
);

// STUDENT DASHBOARD
router.get(
    "/student",
    authenticate,
    authorizeRoles("student"),
    dashboardController.getStudentDashboard
);

module.exports = router;

