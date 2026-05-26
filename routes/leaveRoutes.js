const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkSubscription = require("../middleware/checkSubscription");
const roleCheck = require("../middleware/roleCheck");
const leaveController = require("../controllers/leaveController");

router.post(
  "/",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin", "hradmin", "employee"]),
  leaveController.applyLeave
);

router.get(
  "/",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin", "hradmin", "payrolladmin", "employee"]),
  leaveController.getLeaves
);

router.put(
  "/:id/status",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin", "hradmin"]),
  leaveController.updateLeaveStatus
);

router.delete(
  "/:id",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin", "hradmin"]),
  leaveController.deleteLeave
);

module.exports = router;