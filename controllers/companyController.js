const Company = require("../models/Company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createCompany = async (req, res) => {
  try {
    const { companyName, email, password, subscriptionPlan } = req.body;

    if (!companyName || !email || !password) {
      return res.status(400).json({
        message: "Company name, email and password are required",
      });
    }

    const existingCompany = await Company.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingCompany) {
      return res.status(400).json({
        message: "Company already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const startDate = new Date();
    const endDate = new Date();

    if (subscriptionPlan === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const company = await Company.create({
      companyName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      subscriptionPlan: subscriptionPlan || "monthly",
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,
      status: "active",
    });

    res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (err) {
    console.log("CREATE COMPANY ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select("-password").sort({
      createdAt: -1,
    });

    res.status(200).json(companies);
  } catch (err) {
    console.log("GET COMPANIES ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!company) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    if (company.status !== "active") {
      return res.status(403).json({
        message: "Company subscription is inactive",
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

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: company._id,
        role: "companyadmin",
        companyId: company._id,
      },
      "secretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
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
  } catch (err) {
    console.log("COMPANY LOGIN ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.updateSubscription = async (req, res) => {
  try {
    const { subscriptionPlan, months, status } = req.body;

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const startDate = new Date();
    const endDate = new Date();

    if (subscriptionPlan === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else if (months) {
      endDate.setMonth(endDate.getMonth() + Number(months));
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    company.subscriptionPlan = subscriptionPlan || company.subscriptionPlan;
    company.subscriptionStartDate = startDate;
    company.subscriptionEndDate = endDate;
    company.status = status || "active";

    await company.save();

    res.status(200).json({
      message: "Subscription updated successfully",
      company,
    });
  } catch (err) {
    console.log("UPDATE SUBSCRIPTION ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};