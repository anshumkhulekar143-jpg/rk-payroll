const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkSubscription = require("../middleware/checkSubscription");
const roleCheck = require("../middleware/roleCheck");
const attendanceController = require("../controllers/attendanceController");

router.post(
  "/",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin", "hradmin"]),
  attendanceController.markAttendance
);

router.get(
  "/",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin", "hradmin", "payrolladmin"]),
  attendanceController.getAttendance
);

router.delete(
  "/:id",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin", "hradmin"]),
  attendanceController.deleteAttendance
);

module.exports = router;