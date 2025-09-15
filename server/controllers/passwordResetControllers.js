const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const DatabaseConnection = require("../config/config.js");

db = DatabaseConnection();

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const [rows] = await db.query(
      "SELECT id, provider FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (rows.length === 0 || rows[0].provider !== "local") {
      return res.status(400).json({
        success: false,
        message: "No local account found with this email",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await db.query(
      "UPDATE users SET otp_code = ?, otp_expires_at = NOW() + INTERVAL 15 MINUTE WHERE email = ?",
      [otp, normalizedEmail]
    );

    // Send email
    await transporter.sendMail({
      from: {
        name: "Modern Phonebook",
        address: process.env.NODEMAILER_EMAIL_ADDRESS,
      },
      to: normalizedEmail,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${otp}`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const [rows] = await db.query(
    "SELECT id, otp_code, otp_expires_at FROM users WHERE email = ? AND provider = 'local'",
    [normalizedEmail]
  );

  if (rows.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  const user = rows[0];

  if (user.otp_code !== otp || new Date(user.otp_expires_at) < new Date()) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP" });
  }

  const resetToken = jwt.sign(
    { id: user.id, email: normalizedEmail, action: "reset_password" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.json({
    success: true,
    resetToken,
    message: "OTP verified. Proceed to set new password.",
  });
};

const setNewPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (decoded.action !== "reset_password") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid reset token" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET user_password = ?, otp_code = NULL, otp_expires_at = NULL WHERE id = ?",
      [hashedNewPassword, decoded.id]
    );

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { forgotPassword, verifyResetOtp, setNewPassword };
