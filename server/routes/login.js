const express = require("express");
const login = require("../controllers/loginController.js");
const router = express.Router();

router.post("/api/login", login);

module.exports = router;
