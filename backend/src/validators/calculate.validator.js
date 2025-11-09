const Joi = require('joi');

const calculateSchema = Joi.object({
  travel: Joi.number().min(0).optional(),
  shopping: Joi.number().min(0).optional(),
  fuel: Joi.number().min(0).optional(),
  food: Joi.number().min(0).optional(),
})
  .custom((value, helpers) => {
    const hasAtLeastOneCategory = ['travel', 'shopping', 'fuel', 'food'].some(
      (key) => value[key] !== undefined
    );
    if (!hasAtLeastOneCategory) {
      return helpers.error('any.custom');
    }
    return value;
  }, 'At least one spend validation')
  .messages({
    'any.custom': 'Provide at least one spend category with a value greater than zero',
  });

module.exports = calculateSchema;

