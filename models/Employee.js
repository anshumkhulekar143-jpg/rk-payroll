const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    employeeId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    dob: String,
    aadharNo: String,
    mobileNo: String,
    email: String,

    uanNo: String,
    pfNo: String,
    esiNo: String,

    bankName: String,
    accountNo: String,
    ifscCode: String,

    basicSalary: {
      type: Number,
      default: 0,
    },

    hra: {
      type: Number,
      default: 0,
    },

    allowance: {
      type: Number,
      default: 0,
    },

    grossSalary: {
      type: Number,
      default: 0,
    },

    pf: {
      type: Number,
      default: 0,
    },

    esi: {
      type: Number,
      default: 0,
    },

    pt: {
      type: Number,
      default: 0,
    },

    tds: {
      type: Number,
      default: 0,
    },

    netSalary: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

EmployeeSchema.index(
  { companyId: 1, employeeId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);