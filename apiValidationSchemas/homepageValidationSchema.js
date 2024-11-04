const Joi = require("joi");
const { customCallback } = require("../helpers/joiHelper");

// create
module.exports.create = Joi.object({
  // Aboutus Section
  aboutusTitle: Joi.string().label("Aboutus Title"),
  aboutusSubTitle: Joi.string().label("Aboutus Sub Title"),
  aboutusImage: Joi.string().allow("").label("Aboutus Image"),
  aboutusVideo: Joi.string().allow("").label("Aboutus Video"),
  aboutusDescription: Joi.string().allow("").label("Aboutus Description"),
  aboutusButtonText: Joi.string().allow("").label("Aboutus Button Text"),
  aboutusButtonLink: Joi.string().allow("").label("Aboutus Button Link"),

  // Marketing Title
  marketingSecTitle: Joi.string().label("Marketing Section Title"),
  marketingSecSubTitle: Joi.string().label("Marketing Section Sub Title"),
  marketingSecDescription: Joi.string()
    .allow("")
    .label("Marketing Section Description"),
  marketingSecImage: Joi.string().allow("").label("Marketing Section Image"),
  marketingSecVideo: Joi.string().allow("").label("Marketing Section Video"),
  marketingSecButtonText: Joi.string()
    .allow("")
    .label("Marketing Section Button Text"),
  marketingSecButtonLink: Joi.string()
    .allow("")
    .label("Marketing Section Button Link"),

  // Featured Section
  featuredSecTitle: Joi.string().label("Featured Section Title"),
  featuredSecSubTitle: Joi.string().label("Featured Section Sub Title"),
  featuredSecDescription: Joi.string()
    .allow("")
    .label("Featured Section Description"),
  featuredSecTabs: Joi.array(),

  // Gallery Section
  gallerySecTitle: Joi.string().label("Gallery Section Title"),
  gallerySecSubTitle: Joi.string().label("Gallery Section Sub Title"),
  gallerySecDescription: Joi.string()
    .allow("")
    .label("Gallery Section Description"),
  gallerySecvideos: Joi.array(),

  // Blog Section
  blogSecTitle: Joi.string().label("Blog Section Title"),
  blogSecSubTitle: Joi.string().label("Blog Section Sub Title"),
  blogSecDescription: Joi.string().allow("").label("Blog Section Description"),

  // Inquiry Section
  inquirySecTitle: Joi.string().label("Inquiry Section Title"),
  inquirySecSubTitle: Joi.string().label("Inquiry Section Sub Title"),
  inquirySecDescription: Joi.string()
    .allow("")
    .label("Inquiry Section Description"),
  inquirySecImage: Joi.string().allow("").label("Inquiry Section Image"),
});
