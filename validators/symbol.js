const joi = require('joi');

const symbolValidator = joi.object({
    symbol: joi.string()
        .required()
        .alphanum()
        .min(3)
        .max(5)
        .uppercase(),
    userId: joi.number()
        .required()
});

module.exports = symbolValidator;