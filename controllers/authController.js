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

      const isCompanyPasswordMatch = await bcrypt.compare(password, company.password);

      if (!isCompanyPasswordMatch) {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }

      if (company.status !== "active") {
        return res.status(403).json({
          message: "Company subscription inactive",
        });
      }

      if (
        company.subscriptionEndDate &&
        new Date(company.subscriptionEndDate) < new Date()
      ) {
        company.status = "inactive";
        await company.save();

        return res.status(403).json({
          message: "Subscription expired",
        });
      }

      const token = jwt.sign(
        {
          id: company._id,
          companyId: company._id,
          role: "companyadmin",
        },
        "secretkey",
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: "Company login successful",
        token,
        user: {
          id: company._id,
          companyId: company._id,
          name: company.companyName,
          email: company.email,
          role: "companyadmin",
        },
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "User account inactive",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        companyId: user.companyId,
        employeeId: user.employeeId,
        role: user.role,
      },
      "secretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        companyId: user.companyId,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};