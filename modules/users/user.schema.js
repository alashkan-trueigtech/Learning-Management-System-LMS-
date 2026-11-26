
const createInstructorSchema = {
    type: "object",
    properties: {
        firstName: {
            type: "string",
            minLength: 2,
            maxLength: 50,
        },
        lastName: {
            type: "string",
            minLength: 2,
            maxLength: 50,
        },
        email: {
            type: "string",
            format: "email",
            maxLength: 100,
        },
        password: {
            type: "string",
            minLength: 8,
            maxLength: 72,
        },
    },
    required: [
        "firstName",
        "lastName",
        "email",
        "password",
    ],
    additionalProperties: false,
};

module.exports = {
    createInstructorSchema,
};
