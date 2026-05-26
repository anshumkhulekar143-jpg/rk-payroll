const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;
    const { employeeId, date, status, overtimeHours, lateMark } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({
        message: "Employee, date and status are required",
      });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { companyId, employeeId, date },
      {
        companyId,
        employeeId,
        date,
        status,
        overtimeHours: Number(overtimeHours) || 0,
        lateMark: Boolean(lateMark),
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Attendance saved successfully",
      attendance,
    });
  } catch (err) {
    console.log("MARK ATTENDANCE ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;
    const { month } = req.query;

    let filter = { companyId };

    if (month) {
      filter.date = { $regex: `^${month}` };
    }

    const attendance = await Attendance.find(filter)
      .populate("employeeId", "employeeId name mobileNo")
      .sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (err) {
    console.log("GET ATTENDANCE ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;

    const attendance = await Attendance.findOneAndDelete({
      _id: req.params.id,
      companyId,
    });

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance not found",
      });
    }

    res.status(200).json({
      message: "Attendance deleted successfully",
    });
  } catch (err) {
    console.log("DELETE ATTENDANCE ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};