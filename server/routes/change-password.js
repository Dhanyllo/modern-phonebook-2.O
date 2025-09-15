const express = require("express");
const changePassword = require("../controllers/changePasswordController.js");

const router = express.Router();

router.post("/api/change-password", changePassword);

module.exports = router;
