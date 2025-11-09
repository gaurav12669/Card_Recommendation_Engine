const Joi = require('joi');
const ApiError = require('../errors/ApiError');

function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return next(ApiError.badRequest('Validation failed', details));
    }

    req[property] = value;
    return next();
  };
}

module.exports = validate;

