const mongoose = require("mongoose");
const { BOOKING_STATUS } = require("../../constants/bookingStatus");
const modelSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    mobile: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "program",
      required: true,
    },
    programPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "programPlan",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    planDuration: {
      type: Number,
      required: true,
      default: 0,
    },

    salePriceInr: {
      type: Number,
      required: true,
      default: 0,
    },
    mrpInr: {
      type: Number,
      required: true,
      default: 0,
    },
    salePriceDollar: {
      type: Number,
      required: true,
      default: 0,
    },
    mrpDollar: {
      type: Number,
      required: true,
      default: 0,
    },

    couponCode: {
      type: String,
      default: "",
    },
    couponDiscountAmount: {
      type: Number,
      default: 0,
    },
    subtotalAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },

    ptSession: {
      type: Number,
      default: 0,
    },
    groupSession: {
      type: Number,
      default: 0,
    },
    isCancellable: {
      type: Boolean,
      default: false,
      required: true,
    },
    cancellationPeriod: {
      type: Number,
      default: 0,
      required: true,
    },

    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trainer",
      default: null,
    },

    // Payment Details
    bookingId: {},
    currency: {},
    paymentStatus: {},
    paymentDate: {},
    razorpay_payment_id: {},
    razorpay_signature: {},
    razorpay_order_id: {},

    bookingStatus: { type: String, enum: BOOKING_STATUS },

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

module.exports = mongoose.model("booking", modelSchema);
