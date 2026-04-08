// defined user routes
// user controller

const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
//define routes
//middleware
const {
  authenticate,
  verifyTempToken,
  isAdmin,
} = require("../middlewares/authMiddleware");

route.post("/", userController.createUser);
route.post("/login", authController.login);
route.post("/verify-otp", verifyTempToken, authController.verifyOtp);

route.patch("/:id/unblock", authenticate, isAdmin, authController.unblockUser);

route.get("/list", userController.getAllUsers);

route.get("/:id", userController.getUserbyId);
route.put("/:id", userController.updateUsers);
route.delete("/:id", userController.deleteUsers);

module.exports = route;
