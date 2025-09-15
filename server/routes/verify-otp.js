const express = require("express");
const verifyOtp = require("../controllers/verifyOtpController.js");
const router = express.Router();

router.post("/api/verify-otp", verifyOtp);

module.exports = router;
