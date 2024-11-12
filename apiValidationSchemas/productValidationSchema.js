const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  name: Joi.string().required().label("Name"),
  slug: Joi.string().required().label("Slug"),
  category: Joi.string().required().label("Category"),
  subCategory: Joi.string().required().label("Sub Category"),
  type: Joi.string().label("Type"),
  sizes: Joi.array().label("Sizes"),

  finish: Joi.string().label("Finish"),
  decorName: Joi.string().label("Decor Name"),
  decorNumber: Joi.string().label("Decor Number"),
  sku: Joi.string().label("SKU"),

  salePrice: Joi.number().label("Sale Price"),
  mrp: Joi.number().label("MRP"),

  defaultImage: Joi.string().uri().allow("").label("Default Image"),
  defaultVideo: Joi.string().uri().allow("").label("Default Video"),
  images: Joi.array().items(Joi.string().uri()).label("Images"),

  descriptions: Joi.string().allow("").label("Descriptions"),
  shortDescription: Joi.string().allow("").label("Descriptions"),

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
  category: Joi.string(),
  subCategory: Joi.string(),
  type: Joi.string(),
  sizes: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
  size: Joi.string(),
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
  subCategory: Joi.string().required().label("Sub Category"),
  type: Joi.string().label("Type"),
  sizes: Joi.array().label("Sizes"),

  finish: Joi.string().label("Finish"),
  decorName: Joi.string().label("Decor Name"),
  decorNumber: Joi.string().label("Decor Number"),
  sku: Joi.string().label("SKU"),

  salePrice: Joi.number().label("Sale Price"),
  mrp: Joi.number().label("MRP"),

  defaultImage: Joi.string().uri().allow("").label("Default Image"),
  defaultVideo: Joi.string().uri().allow("").label("Default Video"),
  images: Joi.array().items(Joi.string().uri()).label("Images"),

  descriptions: Joi.string().allow("").label("Descriptions"),
  shortDescription: Joi.string().allow("").label("Descriptions"),

  metaTitle: Joi.string().allow("").label("Meta Title"),
  metaDescription: Joi.string().allow("").label("Meta Descriptions"),
  metaKeywords: Joi.string().allow("").label("Meta Keywords"),
  status: Joi.boolean().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
