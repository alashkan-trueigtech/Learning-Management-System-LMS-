const { Op } = require("sequelize");
const sequelize = require("../../config/database");
const {
    getCache,
    setCache,
    getCacheVersion,
    invalidateCourseCache,
} = require("../../utils/cache");
const {
    Course,
    Category,
    CourseInstructor,
    User,
    Lesson,
    Enrollment,
    Review,
} = require("../../models");

const AppError = require("../../errors/AppError");


// Generate URL-friendly slug
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

// Generate unique course slug
const createUniqueSlug = async (title) => {
    const baseSlug = generateSlug(title);

    let slug = baseSlug;
    let counter = 1;

    while (await Course.findOne({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};

// CREATE COURSE
const createCourse = async (courseData, user) => {
    const course = await sequelize.transaction(async (transaction) => {
        const title = courseData.title.trim();

        const category = await Category.findByPk(
            courseData.categoryId,
            { transaction }
        );

        if (!category) {
            throw new AppError("Category not found", 404);
        }

        if (!category.isActive) {
            throw new AppError(
                "Cannot create course in inactive category",
                400
            );
        }

        const slug = await createUniqueSlug(title);

        const course = await Course.create(
            {
                categoryId: courseData.categoryId,
                title,
                slug,
                description: courseData.description?.trim() || null,
                thumbnail: courseData.thumbnail || null,
                price: courseData.price ?? 0,
                level: courseData.level || "beginner",
                status: "draft",
            },
            { transaction }
        );

        if (user.role === "instructor") {
            await CourseInstructor.create(
                {
                    courseId: course.id,
                    instructorId: user.id,
                    isPrimary: true,
                },
                { transaction }
            );
        }

        return course;
    });

    await invalidateCourseCache();
    return course;
};



const getAllCourses = async (query, user) => {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);

    const limit = Math.min(
        Math.max(parseInt(query.limit, 10) || 10, 1),
        100
    );

    const offset = (page - 1) * limit;
    const where = {};

    if (user.role === "student") {
        where.status = "published";
    } else if (query.status) {
        where.status = query.status;
    }

    if (query.search) {
        where.title = {
            [Op.iLike]: `%${query.search.trim()}%`,
        };
    }

    if (query.categoryId) {
        where.categoryId = query.categoryId;
    }

    if (query.level) {
        where.level = query.level;
    }

    const sortOptions = {
        newest: [["createdAt", "DESC"]],
        oldest: [["createdAt", "ASC"]],
        price_low: [["price", "ASC"]],
        price_high: [["price", "DESC"]],
        title_asc: [["title", "ASC"]],
    };

    const order = sortOptions[query.sort] || sortOptions.newest;

    const cacheVersion = await getCacheVersion();

    const cacheKey = `courses:${cacheVersion}:student:${JSON.stringify({
        page,
        limit,
        search: query.search || "",
        categoryId: query.categoryId || "",
        level: query.level || "",
        sort: query.sort || "newest",
    })}`;

    if (user.role === "student") {
        const cachedCourses = await getCache(cacheKey);

        if (cachedCourses) {
            return cachedCourses;
        }
    }

    const { count, rows } = await Course.findAndCountAll({
        where,
        include: [
            {
                model: Category,
                as: "category",
                attributes: ["id", "name", "slug"],
            },
            {
                model: User,
                as: "instructors",
                attributes: ["id", "firstName", "lastName", "email"],
                through: {
                    attributes: ["isPrimary"],
                },
            },
        ],
        limit,
        offset,
        order,
        distinct: true,
    });

    const result = {
        courses: rows,
        pagination: {
            totalItems: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            pageSize: limit,
        },
    };

    if (user.role === "student") {
        await setCache(cacheKey, result, 60);
    }

    return result;
};


// GET COURSE BY ID
const getCourseById = async (courseId, user) => {
    const course = await Course.findByPk(courseId, {
        include: [
            {
                model: Category,
                as: "category",
                attributes: ["id", "name", "slug"],
            },
            {
                model: User,
                as: "instructors",
                attributes: ["id", "firstName", "lastName", "email"],
                through: {
                    attributes: ["isPrimary"],
                },
            },
        ],
    });

    if (!course) {
        throw new AppError("Course not found", 404);
    }

    // Students can access only published courses
    if (user.role === "student" && course.status !== "published") {
        throw new AppError("Course not found", 404);
    }

    return course;
};


// UPDATE COURSE
const updateCourse = async (courseId, courseData, user) => {
    const course = await Course.findByPk(courseId);

    if (!course) {
        throw new AppError("Course not found", 404);
    }

    // Only admin or assigned instructor can update
    if (user.role === "instructor") {
        const assignment = await CourseInstructor.findOne({
            where: {
                courseId: course.id,
                instructorId: user.id,
            },
        });

        if (!assignment) {
            throw new AppError(
                "You can only update your assigned courses",
                403
            );
        }
    } else if (user.role !== "admin") {
        throw new AppError(
            "You do not have permission to update this course",
            403
        );
    }

    const updateData = { ...courseData };

    // Validate category if categoryId is changing
    if (updateData.categoryId) {
        const category = await Category.findByPk(updateData.categoryId);

        if (!category) {
            throw new AppError("Category not found", 404);
        }

        if (!category.isActive) {
            throw new AppError(
                "Cannot assign course to inactive category",
                400
            );
        }
    }

    // Trim title and generate a new slug if title changes
    if (updateData.title !== undefined) {
        updateData.title = updateData.title.trim();

        if (updateData.title !== course.title) {
            updateData.slug = await createUniqueSlug(updateData.title);
        }
    }

    // Trim description
    if (updateData.description !== undefined) {
        updateData.description = updateData.description.trim() || null;
    }

    await course.update(updateData);
    await invalidateCourseCache();

    return course;
};


// DELETE COURSE
const deleteCourse = async (courseId, user) => {
    const result = await sequelize.transaction(async (transaction) => {
        const course = await Course.findByPk(courseId, {
            transaction,
        });

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        // Only admin or assigned instructor can delete
        if (user.role === "instructor") {
            const assignment = await CourseInstructor.findOne({
                where: {
                    courseId: course.id,
                    instructorId: user.id,
                },
                transaction,
            });

            if (!assignment) {
                throw new AppError(
                    "You can only delete your assigned courses",
                    403
                );
            }
        } else if (user.role !== "admin") {
            throw new AppError(
                "You do not have permission to delete this course",
                403
            );
        }

        // Check dependent records before deletion
        const [lessonCount, enrollmentCount, reviewCount] =
            await Promise.all([
                Lesson.count({
                    where: { courseId: course.id },
                    transaction,
                }),
                Enrollment.count({
                    where: { courseId: course.id },
                    transaction,
                }),
                Review.count({
                    where: { courseId: course.id },
                    transaction,
                }),
            ]);

        if (lessonCount > 0 || enrollmentCount > 0 || reviewCount > 0) {
            throw new AppError(
                "Cannot delete course because it has lessons, enrollments, or reviews. Archive it instead.",
                409
            );
        }

        // Remove instructor assignments and then course
        await CourseInstructor.destroy({
            where: { courseId: course.id },
            transaction,
        });

        await course.destroy({ transaction });

        return true;
    });

    await invalidateCourseCache();
    return result;
};


// UPDATE COURSE STATUS
const updateCourseStatus = async (courseId, status, user) => {
    const course = await Course.findByPk(courseId);

    if (!course) {
        throw new AppError("Course not found", 404);
    }

    // Check permissions
    if (user.role === "instructor") {
        const assignment = await CourseInstructor.findOne({
            where: {
                courseId: course.id,
                instructorId: user.id,
            },
        });

        if (!assignment) {
            throw new AppError(
                "You can only manage your assigned courses",
                403
            );
        }
    } else if (user.role !== "admin") {
        throw new AppError(
            "You do not have permission to change course status",
            403
        );
    }

    // Check category and lessons before publishing
    if (status === "published") {
        const category = await Category.findByPk(course.categoryId);

        if (!category || !category.isActive) {
            throw new AppError(
                "Course category must be active before publishing",
                400
            );
        }

        const lessonCount = await Lesson.count({
            where: { courseId: course.id },
        });

        if (lessonCount === 0) {
            throw new AppError(
                "Cannot publish a course without at least one lesson",
                400
            );
        }
    }

    await course.update({ status });
    await invalidateCourseCache();

    return course;
};


// ASSIGN INSTRUCTOR TO COURSE
const assignInstructor = async (courseId, instructorId, isPrimary = false) => {
    const result = await sequelize.transaction(async (transaction) => {
        const course = await Course.findByPk(courseId, { transaction });

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        const instructor = await User.findByPk(instructorId, { transaction });

        if (!instructor || instructor.role !== "instructor") {
            throw new AppError("Valid instructor not found", 404);
        }

        if (!instructor.isActive) {
            throw new AppError("Cannot assign an inactive instructor", 400);
        }

        const existingAssignment = await CourseInstructor.findOne({
            where: { courseId, instructorId },
            transaction,
        });

        if (existingAssignment) {
            throw new AppError(
                "Instructor is already assigned to this course",
                409
            );
        }

        // Only one primary instructor per course
        if (isPrimary) {
            await CourseInstructor.update(
                { isPrimary: false },
                {
                    where: { courseId },
                    transaction,
                }
            );
        }

        const assignment = await CourseInstructor.create(
            {
                courseId,
                instructorId,
                isPrimary,
            },
            { transaction }
        );

        return assignment;
    });

    await invalidateCourseCache();
    return result;
};


// REMOVE INSTRUCTOR FROM COURSE
const removeInstructor = async (courseId, instructorId) => {
    const result = await sequelize.transaction(async (transaction) => {
        const course = await Course.findByPk(courseId, { transaction });

        if (!course) {
            throw new AppError("Course not found", 404);
        }

        const assignment = await CourseInstructor.findOne({
            where: {
                courseId,
                instructorId,
            },
            transaction,
        });

        if (!assignment) {
            throw new AppError(
                "Instructor is not assigned to this course",
                404
            );
        }

        if (assignment.isPrimary) {
            const otherPrimary = await CourseInstructor.findOne({
                where: {
                    courseId,
                    isPrimary: true,
                    id: { [Op.ne]: assignment.id },
                },
                transaction,
            });

            if (!otherPrimary) {
                throw new AppError(
                    "Assign another primary instructor before removing this instructor",
                    400
                );
            }
        }

        await assignment.destroy({ transaction });

        return true;
    });

    await invalidateCourseCache();
    return result;
};


module.exports = {
    removeInstructor,
    assignInstructor,
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    updateCourseStatus,
};
