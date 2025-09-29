const express = require("express");
const router = express.Router();

// 👇 checks cookies via middleware
router.get("/auth/check", (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

module.exports = router;
