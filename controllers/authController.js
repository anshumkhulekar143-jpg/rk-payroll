const User = require("../models/User");
const Company = require("../models/Company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    let user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    let loginType = "user";

    if (!user) {
      const company = await Company.findOne({
        email: email.toLowerCase().trim(),
      });

      if (!company) {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }

      user = company;
      loginType = "company";
    }

    let isMatch = false;

    if (
      user.password.startsWith("$2a$") ||
      user.password.startsWith("$2b$")
    ) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = password === user.password;
    }

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role || "companyadmin",
        companyId: user.companyId || user._id,
        loginType,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name || user.companyName,
        email: user.email,
        role: user.role || "companyadmin",
        companyId: user.companyId || user._id,
        loginType,
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};