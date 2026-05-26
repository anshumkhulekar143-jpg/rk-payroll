const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { name, email, password, role, employeeId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required",
      });
    }

    const allowedRoles = ["hradmin", "payrolladmin", "employee"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      companyId: loggedInUser.companyId || loggedInUser.id,
      employeeId: employeeId || null,
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      status: "active",
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        companyId: user.companyId,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.log("CREATE USER ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;

    const users = await User.find({ companyId })
      .select("-password")
      .populate("employeeId", "employeeId name")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (err) {
    console.log("GET USERS ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        companyId,
      },
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User status updated",
      user,
    });
  } catch (err) {
    console.log("UPDATE USER STATUS ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user.id;

    const user = await User.findOneAndDelete({
      _id: req.params.id,
      companyId,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.log("DELETE USER ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};