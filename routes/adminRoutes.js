const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Company = require("../models/Company");
const authMiddleware = require("../middleware/auth");
const roleAuth = require("../middleware/roleAuth");

// CREATE COMPANY ADMIN - ONLY SUPERADMIN
router.post("/create-company-admin", authMiddleware, roleAuth("superadmin"), async (req, res) => {
  try {
    const { name, email, password, companyId } = req.body;

    if (!name || !email || !password || !companyId) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "companyadmin",
      companyId,
      isActive: true,
    });

    await newAdmin.save();

    res.status(201).json({
      message: "Company Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        companyId: newAdmin.companyId,
      },
    });
  } catch (error) {
    console.log("Create company admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;