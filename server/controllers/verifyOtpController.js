const DatabaseConnection = require("../config/config.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

db = DatabaseConnection();

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user with valid OTP (local users only)
    const [rows] = await db.query(
      `SELECT id FROM users 
       WHERE email = ? 
         AND provider = 'local'
         AND otp_code = ? 
         AND otp_expires_at > NOW()`,
      [email, otp]
    );

    const user = rows[0];
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email, provider: "local" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email, provider: "local" },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Mark verified + clear OTP + save refresh token
    await db.query(
      `UPDATE users 
       SET is_verified = TRUE, 
           otp_code = NULL, 
           otp_expires_at = NULL, 
           refresh_token = ? 
       WHERE email = ? AND provider = 'local'`,
      [hashedRefreshToken, email]
    );

    // Store access token in HttpOnly cookie
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    // Store refresh token in HttpOnly cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ success: true, message: "Account verified and logged in" });
  } catch (err) {
    console.error("Error in verify-otp:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyPendingEmail = async (req, res) => {
  try {
    const userId = req.user?.id; // From JWT middleware
    let { otp } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!otp) {
      return res
        .status(400)
        .json({ success: false, message: "OTP is required" });
    }

    otp = otp.trim();

    // Fetch user
    const [rows] = await db.query(
      `SELECT id, email, pending_email, pending_email_otp, pending_email_expires_at, is_verified 
       FROM users 
       WHERE id = ?`,
      [userId]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const user = rows[0];

    if (!user.pending_email) {
      return res
        .status(400)
        .json({ success: false, message: "No pending email update" });
    }

    // Check OTP
    if (user.pending_email_otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > new Date(user.pending_email_expires_at)) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    // Ensure email is still unique
    const [emailCheck] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [user.pending_email]
    );
    if (emailCheck.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // ✅ Move pending_email → email and clear pending fields
    await db.query(
      `UPDATE users 
       SET email = ?, 
           pending_email = NULL, 
           pending_email_otp = NULL, 
           pending_email_expires_at = NULL
       WHERE id = ?`,
      [user.pending_email, userId]
    );

    res.json({
      success: true,
      message: "Email updated and verified successfully",
      newEmail: user.pending_email,
    });
  } catch (err) {
    console.error("Verify pending email error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { verifyOtp, verifyPendingEmail };
