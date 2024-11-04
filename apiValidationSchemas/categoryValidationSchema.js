const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  name: Joi.string().required().label("Name"),
  slug: Joi.string().required().label("Slug"),
  textOverImage: Joi.string().label("Text Over Image"),
  image: Joi.string().allow("").label("Image"),
  buttonText: Joi.string().label("Button Text"),
  usp: Joi.array().items(Joi.object()).allow("").label("USP"),
  shortDescription: Joi.string().allow("").label("Short Description"),
  metaTitle: Joi.string().allow("").label("Meta Title"),
  metaDescription: Joi.string().allow("").label("Meta Descriptions"),
  metaKeywords: Joi.string().allow("").label("Meta Keywords"),
  status: Joi.boolean().label("Status"),
});

// findAll
module.exports.findAll = Joi.object({
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  status: Joi.string(),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  name: Joi.string().required().label("Name"),
  slug: Joi.string().required().label("Slug"),
  textOverImage: Joi.string().label("Text Over Image"),
  image: Joi.string().allow("").label("Image"),
  buttonText: Joi.string().label("Button Text"),
  usp: Joi.array().items(Joi.object()).allow("").label("USP"),
  shortDescription: Joi.string().allow("").label("Short Description"),
  metaTitle: Joi.string().allow("").label("Meta Title"),
  metaDescription: Joi.string().allow("").label("Meta Descriptions"),
  metaKeywords: Joi.string().allow("").label("Meta Keywords"),
  status: Joi.boolean().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
