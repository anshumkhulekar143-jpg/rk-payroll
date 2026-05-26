const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
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

    date: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent", "half-day", "paid-leave"],
      required: true,
    },

    overtimeHours: {
      type: Number,
      default: 0,
    },

    lateMark: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

AttendanceSchema.index(
  { companyId: 1, employeeId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);