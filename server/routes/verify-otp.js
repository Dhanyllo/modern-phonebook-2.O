const express = require("express");
const {
  verifyOtp,
  verifyPendingEmail,
} = require("../controllers/verifyOtpController.js");
const router = express.Router();

router.post("/verify-otp", verifyOtp);
router.post("/auth/verify-pending-email", verifyPendingEmail);

module.exports = router;
