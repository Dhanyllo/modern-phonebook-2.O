const express = require("express");
const { getMyProfile } = require("../controllers/getProfileController.js");

const router = express.Router();

// GET /api/me
router.get("/me", getMyProfile);

module.exports = router;
