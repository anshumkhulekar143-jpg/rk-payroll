const mongoose = require("mongoose");

const PayrollSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    month: {
      type: String,
      required: true,
    },

    totalDays: {
      type: Number,
      default: 30,
    },

    presentDays: {
      type: Number,
      default: 0,
    },

    absentDays: {
      type: Number,
      default: 0,
    },

    halfDays: {
      type: Number,
      default: 0,
    },

    paidLeaves: {
      type: Number,
      default: 0,
    },

    payableDays: {
      type: Number,
      default: 0,
    },

    overtimeHours: {
      type: Number,
      default: 0,
    },

    basicSalary: Number,
    hra: Number,
    allowance: Number,

    grossSalary: Number,
    earnedSalary: Number,

    pf: Number,
    esi: Number,
    pt: Number,
    tds: Number,

    netSalary: Number,
  },
  { timestamps: true }
);

PayrollSchema.index(
  { companyId: 1, employeeId: 1, month: 1 },
  { unique: true }
);

module.exports = mongoose.model("Payroll", PayrollSchema);