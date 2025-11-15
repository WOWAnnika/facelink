const joi = require('joi');

const schema = joi.object({
    name: joi.string().min(2).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),


});

exports.userValidation = (req, res, next) => {
    const {error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error });
    }
    next();
}