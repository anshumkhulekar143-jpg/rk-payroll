const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const companyController = require("../controllers/companyController");

router.post(
  "/create",
  auth,
  roleCheck(["superadmin"]),
  companyController.createCompany
);

router.get(
  "/",
  auth,
  roleCheck(["superadmin"]),
  companyController.getCompanies
);

router.post("/login", companyController.companyLogin);

router.put(
  "/:id/subscription",
  auth,
  roleCheck(["superadmin"]),
  companyController.updateSubscription
);

module.exports = router;