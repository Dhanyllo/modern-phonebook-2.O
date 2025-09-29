const express = require("express");
const profileUpdate = require("../controllers/profileUpdateController.js");
const router = express.Router();

router.patch("/api/update-profile", profileUpdate);

module.exports = router;
