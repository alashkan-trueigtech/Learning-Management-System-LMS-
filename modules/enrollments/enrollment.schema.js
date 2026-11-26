const createEnrollmentSchema = {
    type: "object",
    additionalProperties: false,
    required: ["courseId"],
    properties: {
        courseId: {
            type: "string",
            format: "uuid",
        },
    },
};

module.exports = {
    createEnrollmentSchema,
};
