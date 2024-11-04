const mongoose = require("mongoose");
const modelSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    image: { type: String, trim: true },
    description: { type: String, default: "", trim: true },
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

module.exports = mongoose.model("carousel", modelSchema);
