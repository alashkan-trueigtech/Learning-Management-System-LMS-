
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv({
    allErrors: true,
    coerceTypes: false,
});

addFormats(ajv);

const validate = (schema) => {
    const validateSchema = ajv.compile(schema);

    return (req, res, next) => {
        const isValid = validateSchema(req.body);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validateSchema.errors,
            });
        }

        next();
    };
};

module.exports = validate;
