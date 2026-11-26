const createLessonSchema = {
    type: "object",
    additionalProperties: false,
    required: ["title"],
    properties: {
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

        contentType: {
            type: "string",
            enum: ["video", "article", "document"],
        },

        content: {
            type: "string",
        },

        videoUrl: {
            type: "string",
            maxLength: 2000,
        },

        position: {
            type: "integer",
            minimum: 1,
        },

        durationMinutes: {
            type: "integer",
            minimum: 0,
        },

        isPreview: {
            type: "boolean",
        },

        isPublished: {
            type: "boolean",
        },
    },
};

const updateLessonSchema = {
    ...createLessonSchema,
    required: [],
    minProperties: 1,
};

module.exports = {
    createLessonSchema,
    updateLessonSchema,
};
