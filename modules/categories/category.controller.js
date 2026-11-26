const categoryService = require("./category.service");

// CREATE CATEGORY
const createCategory = async (req, res, next) => {
    try {
        const category = await categoryService.createCategory(req.body);

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

// GET ALL CATEGORIES
const getAllCategories = async (req, res, next) => {
    try {
        const result = await categoryService.getAllCategories(req.query);

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: result.categories,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

// GET CATEGORY BY ID
const getCategoryById = async (req, res, next) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE CATEGORY
const updateCategory = async (req, res, next) => {
    try {
        const category = await categoryService.updateCategory(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE CATEGORY
const deleteCategory = async (req, res, next) => {
    try {
        const result = await categoryService.deleteCategory(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
