const joi = require('joi');

const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

exports.loginValidation = (req, res, next) => {
    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    next();
}