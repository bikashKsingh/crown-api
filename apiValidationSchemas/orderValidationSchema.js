const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");
const { ORDER_STATUS } = require("../constants/orderStatus");

// create
module.exports.create = Joi.object({
  name: Joi.string().required().label("Name"),
  mobile: Joi.string()
    .regex(/^\d{10}$/) // Allows exactly 10 digits
    .messages({
      "string.empty": `"Mobile" must contain a value`,
      "string.pattern.base": `"Mobile" must be a valid 10-digit number"`,
    })
    .required()
    .label("Mobile"),
  email: Joi.string().email().trim().required().label("Email"),

  // Shipping Address
  address: Joi.string().required().label("Address"),
  locality: Joi.string().required().allow("").label("Locality"),
  city: Joi.string().required().allow("").label("City"),
  state: Joi.string().required().allow("").label("State"),
  country: Joi.string().required().allow("").label("Country"),
  pincode: Joi.string().required().allow("").label("Pincode"),

  products: Joi.array()
    .items(
      Joi.object({
        product: Joi.custom(customCallback).label("Product"),
        qty: Joi.number().label("Qty"),
      })
    )
    .required()
    .label("Products"),
});

// findAll
module.exports.findAll = Joi.object({
  page: Joi.string(),
  limit: Joi.string(),
  searchQuery: Joi.string(),
  product: Joi.string(),
});

// findById
module.exports.findById = Joi.object({
  id: Joi.custom(customCallback),
});

// update
module.exports.update = Joi.object({
  name: Joi.string().label("Name"),
  mobile: Joi.string()
    .regex(/^\d{10}$/) // Allows exactly 10 digits
    .messages({
      "string.empty": `"Mobile" must contain a value`,
      "string.pattern.base": `"Mobile" must be a valid 10-digit number"`,
    })
    .label("Mobile"),
  email: Joi.string().email().label("Email"),

  // Shipping Address
  address: Joi.string().label("Address"),
  locality: Joi.string().allow("").label("Locality"),
  city: Joi.string().allow("").label("City"),
  state: Joi.string().allow("").label("State"),
  country: Joi.string().allow("").label("Country"),
  pincode: Joi.string().allow("").label("Pincode"),
  orderStatus: Joi.string().valid(...ORDER_STATUS, ""),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
