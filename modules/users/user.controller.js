const userService = require("./user.service");

// GET ALL USERS
const getAllUsers = async (req, res, next) => {
    try {
        const result = await userService.getAllUsers(req.query);

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result.users,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

// CREATE INSTRUCTOR
const createInstructor = async (req, res, next) => {
    try {
        const instructor = await userService.createInstructor(req.body);

        return res.status(201).json({
            success: true,
            message: "Instructor created successfully",
            data: instructor,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    createInstructor,
};
