export const validateBody = (schema) => (req, res, next) => {
    schema.parse(req.body);
    next();
};

export const validateQuery = (schema) => (req, res, next) => {
    schema.parse(req.query);
    next();
};

export const validateParams = (schema) => (req, res, next) => {
    schema.parse(req.params);
    next();
};
