const bcrypt = require("bcrypt");
const DatabaseConnection = require("../config/config.js");
const generateTokens = require("../utils/generateTokens.js");

db = DatabaseConnection();

const googleAuth = async (req, res) => {
  console.log("inside google callback function");
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
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      // path: "/",
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // path: "/",
    });

    res.redirect("http://localhost:5173");
  } catch (err) {
    console.error("Google callback error:", err);
    res.redirect("http://localhost:5173/login");
  }
};

module.exports = googleAuth;
