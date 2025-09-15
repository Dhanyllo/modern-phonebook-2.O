const DatabaseConnection = require("../config/config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

db = DatabaseConnection();

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Find user
    const [rows] = await db.query(
      "SELECT id, email, user_password, is_verified, provider FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = rows[0];

    // Check provider (must be "local")
    if (user.provider !== "local") {
      return res.status(400).json({
        success: false,
        message: `This account is registered via ${user.provider}. Please use ${user.provider} login.`,
      });
    }

    // Check if verified
    if (!user.is_verified) {
      return res
        .status(403)
        .json({ success: false, message: "Email not verified" });
    }

    //  Compare password
    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Save refresh token
    await db.query("UPDATE users SET refresh_token = ? WHERE id = ?", [
      hashedRefreshToken,
      user.id,
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

    res.json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = login;
