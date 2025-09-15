const DatabaseConnection = require("../config/config.js");

db = DatabaseConnection();

const resetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    // Check if local user exists
    const [existing] = await db.query(
      "SELECT id, is_verified FROM users WHERE email = ? AND provider = 'local'",
      [email]
    );

    if (existing.length === 0) {
      return res
        .status(404)
        .json({ message: "Email not found for local signup." });
    }

    // If already verified, no need to reset OTP
    if (existing[0].is_verified) {
      return res
        .status(400)
        .json({ message: "Email is already verified. Please log in." });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update OTP and expiration
    await db.query(
      `UPDATE users 
       SET otp_code = ?, otp_expires_at = NOW() + INTERVAL 10 MINUTE
       WHERE email = ? AND provider = 'local'`,
      [otp, email]
    );

    // Send OTP email
    await transporter.sendMail({
      from: {
        name: "Modern Phonebook",
        address: process.env.NODEMAILER_EMAIL_ADDRESS,
      },
      to: email,
      subject: "Your New OTP Code",
      text: `Your new OTP is: ${otp}`,
    });

    res.json({ message: "New OTP sent. Please verify your email." });
  } catch (err) {
    console.error("Error in reset-otp:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = resetOtp;
