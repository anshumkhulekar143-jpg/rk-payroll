const Employee = require("../models/Employee");

function calculateSalary(data) {
  const basicSalary = Number(data.basicSalary) || 0;
  const hra = Number(data.hra) || 0;
  const allowance = Number(data.allowance) || 0;

  const grossSalary = basicSalary + hra + allowance;

  const pf = Math.round(basicSalary * 0.12);
  const esi = grossSalary <= 21000 ? Math.round(grossSalary * 0.0075) : 0;
  const pt = grossSalary >= 15000 ? 200 : 0;
  const tds = grossSalary >= 50000 ? Math.round(grossSalary * 0.1) : 0;

  const netSalary = grossSalary - pf - esi - pt - tds;

  return {
    grossSalary,
    pf,
    esi,
    pt,
    tds,
    netSalary,
  };
}

exports.createEmployee = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;

    const salary = calculateSalary(req.body);

    const employee = await Employee.create({
      ...req.body,
      companyId,
      ...salary,
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (err) {
    console.log("CREATE EMPLOYEE ERROR:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Employee ID already exists in this company",
      });
    }

    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;

    const employees = await Employee.find({ companyId }).sort({
      createdAt: -1,
    });

    res.status(200).json(employees);
  } catch (err) {
    console.log("GET EMPLOYEES ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;

    const salary = calculateSalary(req.body);

    const employee = await Employee.findOneAndUpdate(
      {
        _id: req.params.id,
        companyId,
      },
      {
        ...req.body,
        ...salary,
      },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (err) {
    console.log("UPDATE EMPLOYEE ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;

    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      companyId,
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
    });
  } catch (err) {
    console.log("DELETE EMPLOYEE ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};