const createReviewSchema = {
    type: "object",
    additionalProperties: false,
    required: ["rating"],
    properties: {
        rating: {
            type: "integer",
            minimum: 1,
            maximum: 5
        },
        comment: {
            type: "string",
            maxLength: 2000
        }
    }
};

const updateReviewSchema = {
    type: "object",
    additionalProperties: false,
    minProperties: 1,
    properties: {
        rating: {
            type: "integer",
            minimum: 1,
            maximum: 5
        },
        comment: {
            type: "string",
            maxLength: 2000
        }
    }
};

module.exports = {
    createReviewSchema,
    updateReviewSchema
};
