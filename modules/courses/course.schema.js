const createCourseSchema = {
    type: "object",
    additionalProperties: false,
    required: ["categoryId", "title"],
    properties: {
        categoryId: {
            type: "string",
            format: "uuid",
        },

        title: {
            type: "string",
            minLength: 3,
            maxLength: 150,
pattern: ".*\\S.*",
        },

        description: {
            type: "string",
            maxLength: 5000,
        },

        thumbnail: {
            type: "string",
            maxLength: 500,
        },

        price: {
            type: "number",
            minimum: 0,
        },

        level: {
            type: "string",
            enum: ["beginner", "intermediate", "advanced"],
        },
    },
};


// UPDATE COURSE SCHEMA
const updateCourseSchema = {
    type: "object",
    additionalProperties: false,
    minProperties: 1,
    properties: {
        categoryId: {
            type: "string",
            format: "uuid",
        },
        title: {
            type: "string",
            minLength: 3,
            maxLength: 150,
pattern: ".*\\S.*",
        },
        description: {
            type: "string",
            maxLength: 5000,
        },
        thumbnail: {
            type: "string",
            maxLength: 500,
        },
        price: {
            type: "number",
            minimum: 0,
        },
        level: {
            type: "string",
            enum: ["beginner", "intermediate", "advanced"],
        },
    },
};


const updateCourseStatusSchema = {
    type: "object",
    additionalProperties: false,
    required: ["status"],
    properties: {
        status: {
            type: "string",
            enum: ["published", "archived"],
        },
    },
};


const assignInstructorSchema = {
    type: "object",
    additionalProperties: false,
    required: ["instructorId"],
    properties: {
        instructorId: {
            type: "string",
            format: "uuid",
        },
        isPrimary: {
            type: "boolean",
        },
    },
};

module.exports = {
    assignInstructorSchema,
    updateCourseStatusSchema,
    createCourseSchema,
    updateCourseSchema,
};
