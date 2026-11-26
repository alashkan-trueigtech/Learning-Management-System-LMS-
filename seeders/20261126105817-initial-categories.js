'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const categories = [
            {
                name: "Programming",
                slug: "programming",
                description: "Programming languages and coding fundamentals",
            },
            {
                name: "Web Development",
                slug: "web-development",
                description: "Frontend and backend web development",
            },
            {
                name: "Database",
                slug: "database",
                description: "Database management and SQL learning",
            },
            {
                name: "Mobile Development",
                slug: "mobile-development",
                description: "Android and iOS application development",
            },
            {
                name: "Software Engineering",
                slug: "software-engineering",
                description: "Software design, development and engineering practices",
            },
        ];

        for (const category of categories) {
            const [existing] = await queryInterface.sequelize.query(
                "SELECT id FROM categories WHERE slug = :slug LIMIT 1",
                {
                    replacements: { slug: category.slug },
                    type: Sequelize.QueryTypes.SELECT,
                }
            );

            if (!existing) {
                await queryInterface.bulkInsert("categories", [{
                    id: Sequelize.literal("gen_random_uuid()"),
                    ...category,
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                }]);
                console.log(`Inserted category: ${category.name}`);
            } else {
                console.log(`Category already exists, skipping: ${category.name}`);
            }
        }
    },

    async down(queryInterface, Sequelize) {
        // Intentionally non-destructive: existing categories and user data
        // should not be deleted by rolling back this initial seeder.
    },
};
