const joi = require('joi');

const schema = {
    user: joi.object({
        name: joi.string().min(2).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    }),
    login: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    }),
    post: joi.object({
        text: joi.string().min(1).max(500).required(),
    })
};

const validate = (schemaName) => {
    return (req, res, next) => {
        const { error } = schema[schemaName].validate(req.body);
        if (error) {
            return res.status(400).json({error: error.details[0].message});
        }
        next();
    }
}

module.exports = {validate};