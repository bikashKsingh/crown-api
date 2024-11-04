const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    slug: { type: String, unique: true, required: true, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },

    defaultImage: { type: String, trim: true },
    defaultVideo: { type: String, trim: true },
    images: [{ type: String, trim: true }],

    descriptions: { type: String, trim: true },
    highlights: { type: String, trim: true },
    requirements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "programRequirement",
      },
    ],
    benefits: { type: String, trim: true, default: "" },
    howItWorks: { type: String, trim: true, default: "" },
    faqs: [
      {
        question: { type: String, trim: true, default: "" },
        answer: { type: String, trim: true, default: "" },
      },
    ],

    metaTitle: { type: String, default: "", trim: true },
    metaDescription: { type: String, default: "", trim: true },
    metaKeywords: { type: String, default: "", trim: true },

    status: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      },
    },
    toJSON: {
      transform: (doc, ret, option) => {
        delete ret.__v;
        delete ret.isDeleted;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("program", modelSchema);
