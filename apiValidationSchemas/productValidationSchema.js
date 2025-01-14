const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  name: Joi.string().required().label("Name"),
  slug: Joi.string().required().label("Slug"),
  categories: Joi.array().items(Joi.string()).required().label("Categories"),
  subCategories: Joi.array()
    .items(Joi.string())
    .required()
    .label("Sub Categories"),
  decorSeries: Joi.string().label("Decor Series"),
  sizes: Joi.array().label("Sizes"),

  finish: Joi.string().label("Finish"),
  decorName: Joi.string().label("Decor Name"),
  decorNumber: Joi.string().label("Decor Number"),
  sku: Joi.string().label("SKU"),

  salePrice: Joi.number().label("Sale Price"),
  mrp: Joi.number().label("MRP"),

  a4Image: Joi.string().uri().allow("").label("A4 Image"),
  fullSheetImage: Joi.string().uri().allow("").label("Full Sheet Image"),
  highResolutionImage: Joi.string()
    .uri()
    .allow("")
    .label("High Resolution Image"),

  defaultVideo: Joi.string().uri().allow("").label("Default Video"),
  images: Joi.array().items(Joi.string().uri()).label("Images"),

  descriptions: Joi.string().allow("").label("Descriptions"),
  shortDescription: Joi.string().allow("").label("Descriptions"),

  ralNumber: Joi.string().allow("").label("Ral Number"),

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

  categories: Joi.array(),
  subCategories: Joi.array(),

  decorSeries: Joi.string(),
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
  categories: Joi.array().items(Joi.string()).required().label("Categories"),
  subCategories: Joi.array()
    .items(Joi.string())
    .required()
    .label("Sub Categories"),
  decorSeries: Joi.string().label("Decor Series"),
  sizes: Joi.array().label("Sizes"),

  finish: Joi.string().label("Finish"),
  decorName: Joi.string().label("Decor Name"),
  decorNumber: Joi.string().label("Decor Number"),
  sku: Joi.string().label("SKU"),

  salePrice: Joi.number().label("Sale Price"),
  mrp: Joi.number().label("MRP"),

  a4Image: Joi.string().uri().allow("").label("A4 Image"),
  fullSheetImage: Joi.string().uri().allow("").label("Full Sheet Image"),
  highResolutionImage: Joi.string()
    .uri()
    .allow("")
    .label("High Resolution Image"),

  defaultVideo: Joi.string().uri().allow("").label("Default Video"),
  images: Joi.array().items(Joi.string().uri()).label("Images"),

  descriptions: Joi.string().allow("").label("Descriptions"),
  shortDescription: Joi.string().allow("").label("Descriptions"),

  ralNumber: Joi.string().allow("").label("Ral Number"),

  metaTitle: Joi.string().allow("").label("Meta Title"),
  metaDescription: Joi.string().allow("").label("Meta Descriptions"),
  metaKeywords: Joi.string().allow("").label("Meta Keywords"),
  status: Joi.boolean().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
