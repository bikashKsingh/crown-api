const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  name: Joi.string().required().label("Name"),
  mobile: Joi.string().required().label("Mobile"),
  email: Joi.string().required().label("Email"),

  programPlan: Joi.custom(customCallback).required().label("Program Plan"),
  category: Joi.custom(customCallback).required().label("Category"),

  couponCode: Joi.string().label("Coupon Code"),
});

// findAll
module.exports.findAll = Joi.object({
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  program: Joi.string(),
  plan: Joi.string(),
  programPlan: Joi.string(),
  user: Joi.string(),
  category: Joi.string(),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  program: Joi.string().required().label("Program"),
  plan: Joi.string().required().label("Plan"),
  planDuration: Joi.number().required().label("Plan Duration"),
  salePriceInr: Joi.number().required().label("Sale Price INR"),
  mrpInr: Joi.number().label("MRP INR"),
  salePriceDollar: Joi.number().required().label("Sale Price Dollar"),
  mrpDollar: Joi.number().label("MRP Dollar"),
  ptSession: Joi.number().label("PT Sessions"),
  groupSession: Joi.number().label("Group Sessions"),
  shortDescription: Joi.string()
    .optional()
    .allow("")
    .label("Short Description"),
  features: Joi.string().allow("").label("Features"),
  isDefault: Joi.boolean().required().label("Is Default"),
  isCancellable: Joi.boolean().required().label("Is Cancellable"),
  cancellationPeriod: Joi.number().required().label("Cancellation Period"),
  status: Joi.boolean().label("Status"),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});