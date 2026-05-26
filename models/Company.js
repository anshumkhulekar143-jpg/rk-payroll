const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    subscriptionPlan: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },

    subscriptionStartDate: {
      type: Date,
      default: Date.now,
    },

    subscriptionEndDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);