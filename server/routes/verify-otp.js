const express = require("express");
const {
  verifyOtp,
  verifyPendingEmail,
} = require("../controllers/verifyOtpController.js");
const router = express.Router();

router.post("/api/verify-otp", verifyOtp);
router.post("/api/verify-pending-email", verifyPendingEmail);

module.exports = router;
