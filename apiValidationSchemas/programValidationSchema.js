const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  name: Joi.string().required().label("Name"),
  slug: Joi.string().required().label("Slug"),
  category: Joi.string().required().label("Category"),

  defaultImage: Joi.string().uri().allow("").label("Default Image"),
  defaultVideo: Joi.string().uri().allow("").label("Default Video"),
  images: Joi.array().items(Joi.string().uri()).label("Images"),

  descriptions: Joi.string().allow("").label("Descriptions"),
  highlights: Joi.string().allow("").label("Highlights"),
  requirements: Joi.array().items(Joi.string()).label("Requirements"),

  benefits: Joi.string().allow("").label("Benefits"),
  howItWorks: Joi.string().allow("").label("How It Works"),

  faqs: Joi.array().items(Joi.object()).label("Faqs"),

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
  category: Joi.string().required().label("Category"),

  defaultImage: Joi.string().uri().allow("").label("Default Image"),
  defaultVideo: Joi.string().uri().allow("").label("Default Video"),
  images: Joi.array().items(Joi.string().uri()).label("Images"),

  descriptions: Joi.string().allow("").label("Descriptions"),
  highlights: Joi.string().allow("").label("Highlights"),
  requirements: Joi.array().items(Joi.string()).label("Requirements"),

  benefits: Joi.string().allow("").label("Benefits"),
  howItWorks: Joi.string().allow("").label("How It Works"),

  faqs: Joi.array().items(Joi.object()).label("Faqs"),

  metaTitle: Joi.string().allow("").label("Meta Title"),
  metaDescription: Joi.string().allow("").label("Meta Descriptions"),
  metaKeywords: Joi.string().allow("").label("Meta Keywords"),
  status: Joi.boolean().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
