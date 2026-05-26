const express = require("express");
const router = express.Router();

const Company = require("../models/Company");
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/auth");

// ✅ DASHBOARD STATS
router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalCompanies = await Company.countDocuments({
      createdBy: userId,
    });

    const totalEmployees = await Employee.countDocuments({
      createdBy: userId,
    });

    const employeesByCompany = await Employee.aggregate([
      {
        $match: { createdBy: req.user.id },
      },
      {
        $group: {
          _id: "$companyName",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalCompanies,
      totalEmployees,
      employeesByCompany,
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;