const DatabaseConnection = require("../config/config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

db = DatabaseConnection();

const logout = async (req, res) => {
  console.log("inside the logout function");
  try {
    const refreshToken = req.cookies.refresh_token;

    if (refreshToken) {
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      } catch (err) {
        decoded = null;
      }

      if (decoded?.id) {
        const [rows] = await db.query(
          "SELECT refresh_token FROM users WHERE id = ?",
          [decoded.id]
        );

        if (rows.length > 0 && rows[0].refresh_token) {
          const match = await bcrypt.compare(
            refreshToken,
            rows[0].refresh_token
          );

          if (match) {
            // Invalidate refresh token
            await db.query(
              "UPDATE users SET refresh_token = NULL WHERE id = ?",
              [decoded.id]
            );
          }
        }
      }
    }

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // path: "/",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // path: "/",
    });

    res.json({ success: true, message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during logout" });
  }
};

module.exports = logout;
