
const crypto = require("crypto");

const sequelize = require("../../config/database");

const { User, RefreshToken } = require("../../models");

const AppError = require("../../errors/AppError");

const {
    hashPassword,
    comparePassword,
} = require("../../utils/password");

const {
    generateAccessToken,
} = require("../../utils/jwt");

// Refresh token validity: 7 days
const REFRESH_TOKEN_DAYS = 7;

// Generate random refresh token
const createRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

// Hash refresh token before database storage
const hashRefreshToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

// Calculate refresh token expiry
const getRefreshExpiry = () => {
    return new Date(
        Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000
    );
};

// Generate access token
const createAccessToken = (user) => {
    return generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
    });
};

// Remove sensitive fields from user response
const getSafeUser = (user) => {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
    };
};

// ==================================
// REGISTER USER
// ==================================

const registerUser = async (userData) => {
    const {
        firstName,
        lastName,
        email,
        password,
    } = userData;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        where: {
            email: normalizedEmail,
        },
    });

    if (existingUser) {
        throw new AppError("Email already registered", 409);
    }

    const hashedPassword = await hashPassword(password);

    try {
        const newUser = await User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        return getSafeUser(newUser);

    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            throw new AppError("Email already registered", 409);
        }

        throw error;
    }
};

// ==================================
// LOGIN USER
// ==================================

const loginUser = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        where: {
            email: normalizedEmail,
        },
    });

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
        throw new AppError("Your account is inactive", 403);
    }

    const isPasswordValid = await comparePassword(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const accessToken = createAccessToken(user);

    const refreshToken = createRefreshToken();

    await RefreshToken.create({
        userId: user.id,
        tokenHash: hashRefreshToken(refreshToken),
        expiresAt: getRefreshExpiry(),
    });

    return {
        user: getSafeUser(user),
        accessToken,
        refreshToken,
    };
};

// ==================================
// REFRESH ACCESS TOKEN
// ==================================

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken || typeof refreshToken !== "string") {
        throw new AppError("Refresh token required", 400);
    }

    const tokenHash = hashRefreshToken(refreshToken);

    return sequelize.transaction(async (transaction) => {

        const storedToken = await RefreshToken.findOne({
            where: {
                tokenHash,
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!storedToken) {
            throw new AppError("Invalid refresh token", 401);
        }

        if (
            storedToken.revokedAt ||
            new Date(storedToken.expiresAt) <= new Date()
        ) {
            throw new AppError("Refresh token expired or revoked", 401);
        }

        const user = await User.findByPk(storedToken.userId, {
            transaction,
        });

        if (!user || !user.isActive) {
            throw new AppError("User not found or inactive", 401);
        }

        const newRefreshToken = createRefreshToken();

        // Revoke old refresh token
        await storedToken.update(
            {
                revokedAt: new Date(),
            },
            {
                transaction,
            }
        );

        // Save new refresh token
        await RefreshToken.create(
            {
                userId: user.id,
                tokenHash: hashRefreshToken(newRefreshToken),
                expiresAt: getRefreshExpiry(),
            },
            {
                transaction,
            }
        );

        return {
            accessToken: createAccessToken(user),
            refreshToken: newRefreshToken,
        };
    });
};

// ==================================
// LOGOUT USER
// ==================================

const logoutUser = async (refreshToken) => {
    if (!refreshToken || typeof refreshToken !== "string") {
        throw new AppError("Refresh token required", 400);
    }

    const tokenHash = hashRefreshToken(refreshToken);

    await RefreshToken.update(
        {
            revokedAt: new Date(),
        },
        {
            where: {
                tokenHash,
                revokedAt: null,
            },
        }
    );

    return {
        loggedOut: true,
    };
};

// ==================================
// GET USER PROFILE
// ==================================

const getUserProfile = async (userId) => {
    const user = await User.findByPk(userId, {
        attributes: {
            exclude: ["password"],
        },
    });

    if (!user || !user.isActive) {
        throw new AppError("User not found or inactive", 404);
    }

    return user;
};

// ==================================
// EXPORT SERVICES
// ==================================

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getUserProfile,
};
