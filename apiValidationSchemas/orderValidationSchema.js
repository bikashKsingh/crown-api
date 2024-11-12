const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");
const { ORDER_STATUS } = require("../constants/orderStatus");

// create
module.exports.create = Joi.object({
  name: Joi.string().required().label("Name"),
  mobile: Joi.string().required().label("Mobile"),
  email: Joi.string().required().label("Email"),

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
  name: Joi.string().required().label("Name"),
  mobile: Joi.string().required().label("Mobile"),
  email: Joi.string().required().label("Email"),

  // Shipping Address
  address: Joi.string().required().label("Address"),
  locality: Joi.string().required().allow("").label("Locality"),
  city: Joi.string().required().allow("").label("City"),
  state: Joi.string().required().allow("").label("State"),
  country: Joi.string().required().allow("").label("Country"),
  pincode: Joi.string().required().allow("").label("Pincode"),
  orderStatus: Joi.string().valid(...ORDER_STATUS, ""),
});

// deleteMultiple
module.exports.deleteMultiple = Joi.object({
  ids: Joi.array().items(Joi.custom(customCallback)).required(),
});
