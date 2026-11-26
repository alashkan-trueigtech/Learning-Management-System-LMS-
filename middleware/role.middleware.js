const AppError = require("../errors/AppError");

// Check whether logged-in user has an allowed role
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // User must be authenticated first
        if (!req.user) {
            return next(
                new AppError("Please login first", 401)
            );
        }

        // Check user's role
        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new AppError(
                    "You do not have permission to perform this action",
                    403
                )
            );
        }

        next();
    };
};

module.exports = authorizeRoles;
