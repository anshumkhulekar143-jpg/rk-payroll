const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkSubscription = require("../middleware/checkSubscription");
const roleCheck = require("../middleware/roleCheck");
const userController = require("../controllers/userController");

router.post(
  "/",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin"]),
  userController.createUser
);

router.get(
  "/",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin"]),
  userController.getUsers
);

router.put(
  "/:id/status",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin"]),
  userController.updateUserStatus
);

router.delete(
  "/:id",
  auth,
  checkSubscription,
  roleCheck(["superadmin", "companyadmin"]),
  userController.deleteUser
);

module.exports = router;