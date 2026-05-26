const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkSubscription = require("../middleware/checkSubscription");
const roleCheck = require("../middleware/roleCheck");
const employeeController = require("../controllers/employeeController");

router.post(
  "/",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin", "hradmin"]),
  employeeController.createEmployee
);

router.get(
  "/",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin", "hradmin", "payrolladmin"]),
  employeeController.getEmployees
);

router.put(
  "/:id",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin", "hradmin"]),
  employeeController.updateEmployee
);

router.delete(
  "/:id",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin"]),
  employeeController.deleteEmployee
);

module.exports = router;