const express = require("express");
const router = express.Router();
const resendOtp = require("../controllers/resendOtpController.js");

router.post("/auth/resend-otp", resendOtp);

module.exports = router;
