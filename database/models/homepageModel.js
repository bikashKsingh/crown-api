const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    // About us Section
    aboutusTitle: { type: String, trim: true },
    aboutusSubTitle: { type: String, trim: true },
    aboutusImage: { type: String, trim: true },
    aboutusVideo: { type: String, trim: true },
    aboutusDescription: { type: String, trim: true },
    aboutusButtonText: { type: String, trim: true },
    aboutusButtonLink: { type: String, trim: true },

    // Marketing Section
    marketingSecTitle: { type: String, trim: true },
    marketingSecSubTitle: { type: String, trim: true },
    marketingSecDescription: { type: String, trim: true },
    marketingSecImage: { type: String, trim: true },
    marketingSecVideo: { type: String, trim: true },
    marketingSecButtonText: { type: String, trim: true },
    marketingSecButtonLink: { type: String, trim: true },

    // Featured Section
    featuredSecTitle: { type: String, trim: true },
    featuredSecSubTitle: { type: String, trim: true },
    featuredSecDescription: { type: String, trim: true },
    featuredSecTabs: [
      {
        tabTitle: String,
        image: String,
      },
    ],

    // Gallery Section
    gallerySecTitle: { type: String, trim: true },
    gallerySecSubTitle: { type: String, trim: true },
    gallerySecDescription: { type: String, trim: true },
    gallerySecvideos: [
      {
        type: String,
      },
    ],

    // Blog Section
    blogSecTitle: { type: String, trim: true },
    blogSecSubTitle: { type: String, trim: true },
    blogSecDescription: { type: String, trim: true },

    // Inquiry Section
    inquirySecTitle: { type: String, trim: true },
    inquirySecSubTitle: { type: String, trim: true },
    inquirySecDescription: { type: String, trim: true },
    inquirySecImage: { type: String, trim: true },

    status: { type: Boolean, default: true, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("homepage", modelSchema);
