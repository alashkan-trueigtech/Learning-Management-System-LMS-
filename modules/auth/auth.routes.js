
const express = require("express");

const router = express.Router();

const authController = require("./auth.controller");

const {
    authenticate,
} = require("../../middleware/auth.middleware");

const validate = require("../../middleware/validate.middleware");

const {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
} = require("./auth.schema");

// ==================================
// REGISTER API
// ==================================

router.post(
    "/register",
    validate(registerSchema),
    authController.register
);

// ==================================
// LOGIN API
// ==================================

router.post(
    "/login",
    validate(loginSchema),
    authController.login
);

// ==================================
// REFRESH TOKEN API
// ==================================

router.post(
    "/refresh",
    validate(refreshTokenSchema),
    authController.refresh
);

// ==================================
// LOGOUT API
// ==================================

router.post(
    "/logout",
    validate(refreshTokenSchema),
    authController.logout
);

// ==================================
// GET PROFILE API
// ==================================

router.get(
    "/me",
    authenticate,
    authController.getProfile
);

module.exports = router;
