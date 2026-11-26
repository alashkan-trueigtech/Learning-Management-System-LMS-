
const { Op } = require("sequelize");
const { User } = require("../../models");
const AppError = require("../../errors/AppError");
const { hashPassword } = require("../../utils/password");

// GET ALL USERS
const getAllUsers = async (options = {}) => {
    const page = Math.max(Number(options.page) || 1, 1);
    const limit = Math.min(
        Math.max(Number(options.limit) || 10, 1),
        100
    );

    const offset = (page - 1) * limit;
    const where = {};

    if (options.search && options.search.trim()) {
        const search = options.search.trim();

        where[Op.or] = [
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
        ];
    }

    if (options.role) {
        const allowedRoles = ["admin", "instructor", "student"];

        if (!allowedRoles.includes(options.role)) {
            throw new AppError("Invalid user role", 400);
        }

        where.role = options.role;
    }

    if (options.isActive !== undefined) {
        if (!["true", "false"].includes(options.isActive)) {
            throw new AppError("isActive must be true or false", 400);
        }

        where.isActive = options.isActive === "true";
    }

    const { count, rows } = await User.findAndCountAll({
        where,
        attributes: { exclude: ["password"] },
        limit,
        offset,
        order: [["createdAt", "DESC"]],
    });

    return {
        users: rows,
        pagination: {
            totalItems: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            pageSize: limit,
        },
    };
};

// CREATE INSTRUCTOR (ADMIN ONLY)
const createInstructor = async (userData) => {
    const {
        firstName,
        lastName,
        email,
        password,
    } = userData;

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        where: { email: normalizedEmail },
    });

    if (existingUser) {
        throw new AppError("Email already registered", 409);
    }

    const hashedPassword = await hashPassword(password);

    try {
        const instructor = await User.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "instructor",
        });

        return {
            id: instructor.id,
            firstName: instructor.firstName,
            lastName: instructor.lastName,
            email: instructor.email,
            role: instructor.role,
            isActive: instructor.isActive,
        };
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            throw new AppError("Email already registered", 409);
        }

        throw error;
    }
};

module.exports = {
    getAllUsers,
    createInstructor,
};

