
const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    return secret;
};

const generateAccessToken = (payload) => {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "60m",
    });
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, getJwtSecret());
};

module.exports = {
    generateAccessToken,
    verifyAccessToken,
};
