// HOW JOI WORKS:
// Joi lets you describe the exact shape a request body must have using a "schema".
// When a request arrives, you call schema.validate(req.body).
// If the data doesn't match the rules, Joi returns a `error` object with a human-readable message.
// We use this middleware as a reusable wrapper — you pass it a Joi schema and it
// returns an Express middleware function that validates req.body before the controller runs.

const validate = (schema) => {
    return (req, res, next) => {
        // abortEarly: false  → collect ALL validation errors, not just the first one
        // allowUnknown: false → reject any extra fields not defined in the schema (security)
        const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });

        if (error) {
            // error.details is an array of all validation failures.
            // We map over it to extract just the human-readable messages and join them.
            const messages = error.details.map(d => d.message).join(", ");
            return res.status(400).json({ message: messages });
        }

        next(); // Validation passed — continue to the controller
    };
};

module.exports = validate;
