const express = require("express");
const cors = require("cors");
const progressRoutes = require("./modules/progress/progress.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const authRoutes = require("./modules/auth/auth.routes");
const categoryRoutes = require("./modules/categories/category.routes");
const userRoutes = require("./modules/users/user.routes");
const courseRoutes = require("./modules/courses/course.routes");
const lessonRoutes = require("./modules/lessons/lesson.routes");
const enrollmentRoutes = require("./modules/enrollments/enrollment.routes");
const reviewRoutes = require("./modules/reviews/review.routes");

const AppError = require("./errors/AppError");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(cors());

app.use(express.json({ limit: "10kb" }));

// Authentication routes
app.use("/api/auth", authRoutes);

// Category routes
app.use("/api/categories", categoryRoutes);

// User routes
app.use("/api/users", userRoutes);

// Course routes
app.use("/api/courses", courseRoutes);

// Lesson routes
app.use("/api", lessonRoutes);

// Enrollment routes
app.use("/api/enrollments", enrollmentRoutes);

// Progress routes
app.use("/api/progress", progressRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Handle unknown routes
app.use((req, res, next) => {
    next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;
