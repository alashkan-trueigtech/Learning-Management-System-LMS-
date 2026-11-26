const updateProgressSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
        isCompleted: {
            type: "boolean",
        },
        lastPositionSeconds: {
            type: "integer",
            minimum: 0,
        },
    },
    anyOf: [
        { required: ["isCompleted"] },
        { required: ["lastPositionSeconds"] },
    ],
};

module.exports = {
    updateProgressSchema,
};
