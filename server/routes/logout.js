const express = require("express");
const logout = require("../controllers/logoutController.js");
const router = express.Router();

router.post("/api/logout", logout);

module.exports = router;
