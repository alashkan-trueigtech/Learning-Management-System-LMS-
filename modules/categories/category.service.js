const { Op } = require("sequelize");

const { Category, Course } = require("../../models");

const AppError = require("../../errors/AppError");

// Convert category name into URL-friendly slug
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

// Generate a unique slug
const createUniqueSlug = async (name) => {
    const baseSlug = generateSlug(name);

    let slug = baseSlug;
    let counter = 1;

    while (await Category.findOne({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};

// CREATE CATEGORY
const createCategory = async (categoryData) => {
    const name = categoryData.name.trim();

    const existingCategory = await Category.findOne({
        where: {
            name: {
                [Op.iLike]: name,
            },
        },
    });

    if (existingCategory) {
        throw new AppError("Category already exists", 409);
    }

    const slug = await createUniqueSlug(name);

    try {
        const category = await Category.create({
            name,
            slug,
            description: categoryData.description?.trim() || null,
        });

        return category;
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            throw new AppError("Category name or slug already exists", 409);
        }

        throw error;
    }
};

// GET ALL CATEGORIES
const getAllCategories = async (options = {}) => {
    const page = Math.max(Number(options.page) || 1, 1);
    const limit = Math.min(Math.max(Number(options.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;

    const where = {};

    if (options.search) {
        where.name = {
            [Op.iLike]: `%${options.search.trim()}%`,
        };
    }

    if (options.isActive !== undefined) {
        where.isActive = options.isActive;
    }

    const { count, rows } = await Category.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
    });

    return {
        categories: rows,
        pagination: {
            totalItems: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            pageSize: limit,
        },
    };
};

// GET CATEGORY BY ID
const getCategoryById = async (categoryId) => {
    const category = await Category.findByPk(categoryId, {
        include: [
            {
                model: Course,
                as: "courses",
                attributes: ["id", "title", "slug", "status"],
                required: false,
            },
        ],
    });

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    return category;
};

// UPDATE CATEGORY
const updateCategory = async (categoryId, updateData) => {
    const category = await Category.findByPk(categoryId);

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    const changes = { ...updateData };

    if (changes.name !== undefined) {
        changes.name = changes.name.trim();

        const existingCategory = await Category.findOne({
            where: {
                name: {
                    [Op.iLike]: changes.name,
                },
                id: {
                    [Op.ne]: categoryId,
                },
            },
        });

        if (existingCategory) {
            throw new AppError("Category name already exists", 409);
        }

        changes.slug = await createUniqueSlug(changes.name);
    }

    if (changes.description !== undefined) {
        changes.description = changes.description.trim() || null;
    }

    try {
        await category.update(changes);
        return category;
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            throw new AppError("Category name or slug already exists", 409);
        }

        throw error;
    }
};

// DELETE CATEGORY
const deleteCategory = async (categoryId) => {
    const category = await Category.findByPk(categoryId);

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    const courseCount = await Course.count({
        where: {
            categoryId,
        },
    });

    if (courseCount > 0) {
        throw new AppError(
            "Cannot delete category because courses are assigned to it",
            409
        );
    }

    await category.destroy();

    return {
        deleted: true,
        id: categoryId,
    };
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
