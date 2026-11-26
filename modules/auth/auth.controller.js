
const authService = require("./auth.service");

// ==================================
// REGISTER
// ==================================

const register = async (req, res, next) => {
    try {
        const user = await authService.registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });

    } catch (error) {
        next(error);
    }
};

// ==================================
// LOGIN
// ==================================

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.loginUser(
            email,
            password
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};

// ==================================
// REFRESH TOKEN
// ==================================

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        const result = await authService.refreshAccessToken(
            refreshToken
        );

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};

// ==================================
// LOGOUT
// ==================================

const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        const result = await authService.logoutUser(
            refreshToken
        );

        return res.status(200).json({
            success: true,
            message: "Logout successful",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};

// ==================================
// GET PROFILE
// ==================================

const getProfile = async (req, res, next) => {
    try {
        const user = await authService.getUserProfile(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: user,
        });

    } catch (error) {
        next(error);
    }
};

// ==================================
// EXPORT CONTROLLERS
// ==================================

module.exports = {
    register,
    login,
    refresh,
    logout,
    getProfile,
};
