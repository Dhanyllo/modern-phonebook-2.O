const DatabaseConnection = require("../config/config.js");
const transporter = require("../config/nodemailer.js");

const db = DatabaseConnection();

const resendOtp = async (req, res) => {
  try {
    // User must already exist but NOT be verified
    const userId = req.user?.id || req.body.userId;
    const email = req.body.email;

    if (!userId && !email) {
      return res.status(400).json({ message: "User not identified" });
    }

    const [users] = await db.query(
      `SELECT id, email, is_verified
       FROM users
       WHERE ${userId ? "id = ?" : "email = ?"}`,
      [userId || email],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    if (user.is_verified) {
      return res.status(400).json({ message: "Account is already verified" });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await db.query(
      `UPDATE users
       SET otp_code = ?, otp_expires_at = NOW() + INTERVAL 10 MINUTE
       WHERE id = ?`,
      [otp, user.id],
    );

    // Send email
    await transporter.sendMail({
      from: {
        name: "Modern Phonebook",
        address: process.env.NODEMAILER_EMAIL_ADDRESS,
      },
      to: user.email,
      subject: "Your New OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error("Error resending OTP:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = resendOtp;
