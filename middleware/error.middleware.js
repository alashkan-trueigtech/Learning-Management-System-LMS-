const AppError = require("../errors/AppError");

const errorMiddleware = (err, req, res, next) => {
    let error = err;

    if (err.name === "SequelizeUniqueConstraintError") {
        error = new AppError("Resource already exists", 409);
    }

    if (err.name === "SequelizeValidationError") {
        error = new AppError(
            err.errors.map((item) => item.message).join(", "),
            400
        );
    }

    const statusCode = error.statusCode || 500;

    const isProduction = process.env.NODE_ENV === "production";

    const response = {
        success: false,
        message: isProduction && statusCode === 500
            ? "Internal server error"
            : error.message || "Something went wrong",
    };

    // Stack trace only in development
    if (!isProduction) {
        response.stack = error.stack;
    }

    return res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
