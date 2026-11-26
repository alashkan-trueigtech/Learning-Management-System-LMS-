const express = require("express");

const router = express.Router();

const categoryController = require("./category.controller");

const { authenticate } = require("../../middleware/auth.middleware");
const authorizeRoles = require("../../middleware/role.middleware");
const validate = require("../../middleware/validate.middleware");

const {
    createCategorySchema,
    updateCategorySchema,
} = require("./category.schema");

// CREATE CATEGORY - ADMIN ONLY
router.post(
    "/",
    authenticate,
    authorizeRoles("admin"),
    validate(createCategorySchema),
    categoryController.createCategory
);

// GET ALL CATEGORIES - LOGGED-IN USERS
router.get(
    "/",
    authenticate,
    categoryController.getAllCategories
);

// GET CATEGORY BY ID - LOGGED-IN USERS
router.get(
    "/:id",
    authenticate,
    categoryController.getCategoryById
);

// UPDATE CATEGORY - ADMIN ONLY
router.patch(
    "/:id",
    authenticate,
    authorizeRoles("admin"),
    validate(updateCategorySchema),
    categoryController.updateCategory
);

// DELETE CATEGORY - ADMIN ONLY
router.delete(
    "/:id",
    authenticate,
    authorizeRoles("admin"),
    categoryController.deleteCategory
);

module.exports = router;
