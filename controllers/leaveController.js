const Leave = require("../models/Leave");

exports.applyLeave = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;

    const { employeeId, leaveType, fromDate, toDate, reason } = req.body;

    if (!employeeId || !leaveType || !fromDate || !toDate) {
      return res.status(400).json({
        message: "Employee, leave type, from date and to date are required",
      });
    }

    const leave = await Leave.create({
      companyId,
      employeeId,
      leaveType,
      fromDate,
      toDate,
      reason,
    });

    res.status(201).json({
      message: "Leave applied successfully",
      leave,
    });
  } catch (err) {
    console.log("APPLY LEAVE ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getLeaves = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;

    const leaves = await Leave.find({ companyId })
      .populate("employeeId", "employeeId name mobileNo")
      .sort({ createdAt: -1 });

    res.status(200).json(leaves);
  } catch (err) {
    console.log("GET LEAVES ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        message: "Invalid leave status",
      });
    }

    const leave = await Leave.findOneAndUpdate(
      {
        _id: req.params.id,
        companyId,
      },
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({
        message: "Leave not found",
      });
    }

    res.status(200).json({
      message: "Leave status updated successfully",
      leave,
    });
  } catch (err) {
    console.log("UPDATE LEAVE ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.deleteLeave = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;

    const leave = await Leave.findOneAndDelete({
      _id: req.params.id,
      companyId,
    });

    if (!leave) {
      return res.status(404).json({
        message: "Leave not found",
      });
    }

    res.status(200).json({
      message: "Leave deleted successfully",
    });
  } catch (err) {
    console.log("DELETE LEAVE ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};