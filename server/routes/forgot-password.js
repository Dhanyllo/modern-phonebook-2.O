const express = require("express");
const {
  forgotPassword,
  verifyResetOtp,
  setNewPassword,
} = require("../controllers/passwordResetControllers.js");

const router = express.Router();

router.post("/api/forgot-password", forgotPassword);

router.post("/api/verify-reset-otp", verifyResetOtp);

router.post("/api/set-new-password", setNewPassword);

module.exports = router;
