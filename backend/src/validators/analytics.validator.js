const Joi = require('joi');

const analyticsSchema = Joi.object({
  cardId: Joi.number().integer().min(1).required(),
  cardName: Joi.string().max(200).required(),
  bankName: Joi.string().max(200).optional(),
  userSpends: Joi.object({
    travel: Joi.number().min(0).optional(),
    shopping: Joi.number().min(0).optional(),
    fuel: Joi.number().min(0).optional(),
    food: Joi.number().min(0).optional(),
  })
    .optional()
    .default({}),
  savings: Joi.object({
    totalSavings: Joi.number().min(0).optional(),
    netSavings: Joi.number().min(0).optional(),
    categories: Joi.array()
      .items(
        Joi.object({
          category: Joi.string().required(),
          savings: Joi.number().min(0).required(),
        })
      )
      .optional()
      .default([]),
  })
    .optional()
    .default({}),
  metadata: Joi.object().optional().default({}),
});

module.exports = analyticsSchema;

