const DatabaseConnection = require("../config/config.js");

db = DatabaseConnection();

const resetOtp = async (req, res) => {
  try {
    const { email, context } = req.body;
    // context = "signup" or "pending" (frontend decides which)

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    // Case 1: OTP for signup email
    if (context === "signup") {
      const [existing] = await db.query(
        "SELECT id, is_verified FROM users WHERE email = ? AND provider = 'local'",
        [email]
      );

      if (existing.length === 0) {
        return res
          .status(404)
          .json({ message: "Email not found for local signup." });
      }

      if (existing[0].is_verified) {
        return res
          .status(400)
          .json({ message: "Email is already verified. Please log in." });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await db.query(
        `UPDATE users 
         SET otp_code = ?, otp_expires_at = NOW() + INTERVAL 10 MINUTE
         WHERE email = ? AND provider = 'local'`,
        [otp, email]
      );

      await transporter.sendMail({
        from: {
          name: "Modern Phonebook",
          address: process.env.NODEMAILER_EMAIL_ADDRESS,
        },
        to: email,
        subject: "Your New OTP Code",
        text: `Your new OTP is: ${otp}`,
      });

      return res.json({ message: "New OTP sent. Please verify your email." });
    }

    // Case 2: OTP for pending email update
    if (context === "pending") {
      const [user] = await db.query(
        "SELECT id, pending_email FROM users WHERE pending_email = ? AND provider = 'local'",
        [email]
      );

      if (user.length === 0) {
        return res
          .status(404)
          .json({ message: "No pending email verification found." });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await db.query(
        `UPDATE users 
         SET pending_email_otp = ?, pending_email_expires_at = NOW() + INTERVAL 10 MINUTE
         WHERE pending_email = ? AND provider = 'local'`,
        [otp, email]
      );

      await transporter.sendMail({
        from: {
          name: "Modern Phonebook",
          address: process.env.NODEMAILER_EMAIL_ADDRESS,
        },
        to: email,
        subject: "Verify Your Pending Email",
        text: `Your OTP to confirm your new email is: ${otp}`,
      });

      return res.json({ message: "New OTP sent to your pending email." });
    }

    return res.status(400).json({ message: "Invalid reset OTP context." });
  } catch (err) {
    console.error("Error in reset-otp:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = resetOtp;
