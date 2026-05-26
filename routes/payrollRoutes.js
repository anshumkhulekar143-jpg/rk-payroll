const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkSubscription = require("../middleware/checkSubscription");
const roleCheck = require("../middleware/roleCheck");
const payrollController = require("../controllers/payrollController");

router.post(
  "/generate",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin", "payrolladmin"]),
  payrollController.generatePayroll
);

router.get(
  "/",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin", "payrolladmin"]),
  payrollController.getPayrolls
);

router.delete(
  "/:id",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin"]),
  payrollController.deletePayroll
);

module.exports = router;