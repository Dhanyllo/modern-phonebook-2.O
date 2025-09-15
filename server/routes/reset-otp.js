const express = require("express");
const router = express.Router();
const resetOtp = require("../controllers/resetOtpController.js");

router.post("/api/reset-otp", resetOtp);

module.exports = router;
