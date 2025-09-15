const bcrypt = require("bcrypt");
const DatabaseConnection = require("../config/config.js");
const generateTokens = require("../utils/generateTokens.js");

db = DatabaseConnection();

const googleAuth = async (req, res) => {
  try {
    const { accessToken, refreshToken } = generateTokens(req.user);

    // Save hashed refresh token in DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await db.query(`UPDATE users SET refresh_token = ? WHERE email = ?`, [
      hashedRefreshToken,
      req.user.email,
    ]);

    // Send cookies
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("/"); // frontend home
  } catch (err) {
    console.error("Google callback error:", err);
    res.redirect("/login");
  }
};

module.exports = googleAuth;
