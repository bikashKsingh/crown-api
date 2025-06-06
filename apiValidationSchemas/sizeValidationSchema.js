const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  title: Joi.string().required().label("Title"),
  categories: Joi.array()
    .items(Joi.string())
    .min(1)
    .required()
    .label("Categories"),
  priority: Joi.number().label("Priority"),
  status: Joi.boolean().required().label("Status"),
});

// findAll
module.exports.findAll = Joi.object({
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  categories: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ),
  priority: Joi.string().valid("ASC", "DESC"),
  status: Joi.string().valid("ALL", "", "true", "false"),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  title: Joi.string().label("Title"),
  categories: Joi.array().items(Joi.string()).min(1).label("Categories"),
  priority: Joi.number().label("Priority"),
  status: Joi.boolean().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
