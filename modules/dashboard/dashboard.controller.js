
const dashboardService = require("./dashboard.service");

// ADMIN DASHBOARD
const getAdminDashboard = async (req, res, next) => {
    try {
        const dashboard = await dashboardService.getAdminDashboard();

        res.status(200).json({
            success: true,
            message: "Admin dashboard fetched successfully",
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};

// INSTRUCTOR DASHBOARD
const getInstructorDashboard = async (req, res, next) => {
    try {
        const dashboard = await dashboardService.getInstructorDashboard(
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Instructor dashboard fetched successfully",
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};

// STUDENT DASHBOARD
const getStudentDashboard = async (req, res, next) => {
    try {
        const dashboard = await dashboardService.getStudentDashboard(
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Student dashboard fetched successfully",
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminDashboard,
    getInstructorDashboard,
    getStudentDashboard,
};

