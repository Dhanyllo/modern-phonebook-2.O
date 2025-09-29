const passport = require("../config/passport-google.js");
const express = require("express");
const googleAuth = require("../controllers/googleAuthController.js");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleAuth
);

module.exports = router;
