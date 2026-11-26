
const { verifyAccessToken } = require("../utils/jwt");
const AppError = require("../errors/AppError");

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new AppError("Access token required", 401));
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return next(new AppError("Access token required", 401));
        }

        const decoded = verifyAccessToken(token);

        req.user = decoded;

        next();
    } catch (error) {
        next(new AppError("Invalid or expired access token", 401));
    }
};

module.exports = {
    authenticate,
};
