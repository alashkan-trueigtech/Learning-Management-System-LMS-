
// Create category validation
const createCategorySchema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 100,
        },
        description: {
            type: "string",
            maxLength: 1000,
        },
    },
    required: ["name"],
    additionalProperties: false,
};

// Update category validation
const updateCategorySchema = {
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 100,
        },
        description: {
            type: "string",
            maxLength: 1000,
        },
        isActive: {
            type: "boolean",
        },
    },
    minProperties: 1,
    additionalProperties: false,
};

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};
