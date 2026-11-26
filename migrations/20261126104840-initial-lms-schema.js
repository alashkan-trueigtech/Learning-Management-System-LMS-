'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const existingTables = await queryInterface.showAllTables();
        const tableNames = new Set(
            existingTables.map(table =>
                typeof table === "string" ? table : table.tableName
            )
        );

        const createdTables = new Set();

        const createIfMissing = async (name, columns, options = {}) => {
            if (!tableNames.has(name)) {
                await queryInterface.createTable(name, columns, options);
                createdTables.add(name);
                console.log(`Created table: ${name}`);
            } else {
                console.log(`Table already exists, skipping: ${name}`);
            }
        };

        const id = {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
        };

        const timestamps = {
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        };

        // 1. Users
        await createIfMissing("users", {
            id,
            first_name: { type: Sequelize.STRING(50), allowNull: false },
            last_name: { type: Sequelize.STRING(50), allowNull: false },
            email: { type: Sequelize.STRING(100), allowNull: false, unique: true },
            password: { type: Sequelize.STRING, allowNull: false },
            role: {
                type: Sequelize.ENUM("student", "instructor", "admin"),
                allowNull: false,
                defaultValue: "student",
            },
            is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
            ...timestamps,
        });

        // 2. Categories
        await createIfMissing("categories", {
            id,
            name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
            slug: { type: Sequelize.STRING(120), allowNull: false, unique: true },
            description: { type: Sequelize.TEXT, allowNull: true },
            is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
            ...timestamps,
        });

        // 3. Courses
        await createIfMissing("courses", {
            id,
            category_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: "categories", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            title: { type: Sequelize.STRING(150), allowNull: false },
            slug: { type: Sequelize.STRING(180), allowNull: false, unique: true },
            description: { type: Sequelize.TEXT, allowNull: true },
            thumbnail: { type: Sequelize.STRING, allowNull: true },
            price: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
            level: {
                type: Sequelize.ENUM("beginner", "intermediate", "advanced"),
                defaultValue: "beginner",
            },
            status: {
                type: Sequelize.ENUM("draft", "published", "archived"),
                defaultValue: "draft",
            },
            ...timestamps,
        });

        // 4. Course Instructors
        await createIfMissing("course_instructors", {
            id,
            course_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: "courses", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            instructor_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            is_primary: { type: Sequelize.BOOLEAN, defaultValue: false },
            ...timestamps,
        });

        // 5. Lessons
        await createIfMissing("lessons", {
            id,
            course_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: "courses", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            title: { type: Sequelize.STRING(150), allowNull: false },
            description: { type: Sequelize.TEXT, allowNull: true },
            content_type: {
                type: Sequelize.ENUM("video", "article", "document"),
                allowNull: false,
                defaultValue: "video",
            },
            content: { type: Sequelize.TEXT, allowNull: true },
            video_url: { type: Sequelize.STRING, allowNull: true },
            position: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
            duration_minutes: { type: Sequelize.INTEGER, defaultValue: 0 },
            is_preview: { type: Sequelize.BOOLEAN, defaultValue: false },
            is_published: { type: Sequelize.BOOLEAN, defaultValue: false },
            ...timestamps,
        });

        // 6. Enrollments
        await createIfMissing("enrollments", {
            id,
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            course_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: "courses", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            status: {
                type: Sequelize.ENUM("active", "completed", "cancelled"),
                allowNull: false,
                defaultValue: "active",
            },
            enrolled_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
            completed_at: { type: Sequelize.DATE, allowNull: true },
            ...timestamps,
        });

        // 7. Lesson Progress
        await createIfMissing("lesson_progress", {
            id,
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            lesson_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: "lessons", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            is_completed: { type: Sequelize.BOOLEAN, defaultValue: false },
            completed_at: { type: Sequelize.DATE, allowNull: true },
            last_position_seconds: { type: Sequelize.INTEGER, defaultValue: 0 },
            ...timestamps,
        });

        // 8. Reviews
        await createIfMissing("reviews", {
            id,
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            course_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: "courses", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            rating: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            comment: { type: Sequelize.TEXT, allowNull: true },
            ...timestamps,
        });

        // 9. Refresh Tokens
        await createIfMissing("refresh_tokens", {
            id,
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            token_hash: { type: Sequelize.STRING, allowNull: false, unique: true },
            expires_at: { type: Sequelize.DATE, allowNull: false },
            revoked_at: { type: Sequelize.DATE, allowNull: true },
            ...timestamps,
        });

        // Composite unique constraints for newly created tables only.
        const uniqueConstraints = [
            ["course_instructors", ["course_id", "instructor_id"], "unique_course_instructor"],
            ["enrollments", ["user_id", "course_id"], "unique_user_enrollment"],
            ["lesson_progress", ["user_id", "lesson_id"], "unique_user_lesson_progress"],
            ["reviews", ["user_id", "course_id"], "unique_user_course_review"],
        ];

        for (const [table, fields, name] of uniqueConstraints) {
            if (createdTables.has(table)) {
                await queryInterface.addConstraint(table, {
                    fields,
                    type: "unique",
                    name,
                });
            }
        }
    },

    async down(queryInterface, Sequelize) {
        // Intentionally non-destructive.
        // This baseline migration may skip tables containing existing data.
        // Do not drop existing LMS tables during rollback.
    },
};
