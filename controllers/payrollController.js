const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Payroll = require("../models/Payroll");

function getTotalDays(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(year, monthNumber, 0).getDate();
}

function calculatePayroll(employee, attendance, month) {
  const totalDays = getTotalDays(month);

  let presentDays = 0;
  let absentDays = 0;
  let halfDays = 0;
  let paidLeaves = 0;
  let overtimeHours = 0;

  attendance.forEach((att) => {
    if (att.status === "present") presentDays += 1;
    if (att.status === "absent") absentDays += 1;
    if (att.status === "half-day") halfDays += 1;
    if (att.status === "paid-leave") paidLeaves += 1;

    overtimeHours += Number(att.overtimeHours || 0);
  });

  const payableDays = presentDays + paidLeaves + halfDays * 0.5;

  const basicSalary = Number(employee.basicSalary || 0);
  const hra = Number(employee.hra || 0);
  const allowance = Number(employee.allowance || 0);

  const grossSalary = basicSalary + hra + allowance;

  const perDaySalary = grossSalary / totalDays;

  const earnedSalary = Math.round(perDaySalary * payableDays);

  const pf = Math.round((basicSalary / totalDays) * payableDays * 0.12);
  const esi = earnedSalary <= 21000 ? Math.round(earnedSalary * 0.0075) : 0;
  const pt = earnedSalary >= 15000 ? 200 : 0;
  const tds = earnedSalary >= 50000 ? Math.round(earnedSalary * 0.1) : 0;

  const overtimeAmount = overtimeHours * 100;

  const netSalary = earnedSalary + overtimeAmount - pf - esi - pt - tds;

  return {
    totalDays,
    presentDays,
    absentDays,
    halfDays,
    paidLeaves,
    payableDays,
    overtimeHours,

    basicSalary,
    hra,
    allowance,
    grossSalary,
    earnedSalary,

    pf,
    esi,
    pt,
    tds,
    netSalary,
  };
}

exports.generatePayroll = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;
    const { month } = req.body;

    if (!month) {
      return res.status(400).json({
        message: "Month is required. Example: 2026-05",
      });
    }

    const employees = await Employee.find({ companyId });

    if (employees.length === 0) {
      return res.status(400).json({
        message: "No employees found",
      });
    }

    const generatedPayrolls = [];

    for (const employee of employees) {
      const attendance = await Attendance.find({
        companyId,
        employeeId: employee._id,
        date: { $regex: `^${month}` },
      });

      const salaryData = calculatePayroll(employee, attendance, month);

      const payroll = await Payroll.findOneAndUpdate(
        {
          companyId,
          employeeId: employee._id,
          month,
        },
        {
          companyId,
          employeeId: employee._id,
          month,
          ...salaryData,
        },
        {
          new: true,
          upsert: true,
        }
      );

      generatedPayrolls.push(payroll);
    }

    res.status(200).json({
      message: "Payroll generated successfully",
      payrolls: generatedPayrolls,
    });
  } catch (err) {
    console.log("GENERATE PAYROLL ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getPayrolls = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;
    const { month } = req.query;

    const filter = { companyId };

    if (month) {
      filter.month = month;
    }

    const payrolls = await Payroll.find(filter)
      .populate("employeeId", "employeeId name mobileNo bankName accountNo ifscCode")
      .sort({ createdAt: -1 });

    res.status(200).json(payrolls);
  } catch (err) {
    console.log("GET PAYROLL ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.deletePayroll = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;

    const payroll = await Payroll.findOneAndDelete({
      _id: req.params.id,
      companyId,
    });

    if (!payroll) {
      return res.status(404).json({
        message: "Payroll not found",
      });
    }

    res.status(200).json({
      message: "Payroll deleted successfully",
    });
  } catch (err) {
    console.log("DELETE PAYROLL ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};