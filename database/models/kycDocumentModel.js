const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
    },
    formats: [
      {
        ref: "documentFormat",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
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

module.exports = mongoose.model("kycDocument", modelSchema);
