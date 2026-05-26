const Company = require("../models/Company");

module.exports = async function checkSubscription(req, res, next) {
  try {
    const companyId = req.user.companyId || req.user.id;

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
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

    next();
  } catch (err) {
    console.log("SUBSCRIPTION CHECK ERROR:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};