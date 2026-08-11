const DatabaseConnection = require("../config/config.js");
const bcrypt = require("bcrypt");
const transporter = require("../config/nodemailer.js");
const crypto = require("crypto");

db = DatabaseConnection();

const signUp = async (req, res) => {
  try {
    const otpSessionToken = crypto.randomBytes(32).toString("hex");
    let { first_name, other_names, email, password } = req.body;

    // Normalize inputs
    first_name = first_name
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
    other_names = other_names
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
    email = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email already exists
    const [existingUser] = await db.query(
      "SELECT id, provider, is_verified FROM users WHERE email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      const user = existingUser[0];

      if (user.provider !== "local") {
        return res.status(400).json({
          message: `This email is already registered with ${user.provider}. Please log in using that provider.`,
        });
      }

      if (user.is_verified) {
        return res.status(400).json({
          message: "Email is already registered and verified. Please log in.",
        });
      }

      // Update existing unverified user
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await db.query(
        `UPDATE users
         SET first_name = ?, other_names = ?, user_password = ?, otp_code = ?, otp_expires_at = NOW() + INTERVAL 10 MINUTE, otp_session_token = ?, is_verified = FALSE
         WHERE id = ?`,
        [
          first_name,
          other_names,
          hashedPassword,
          otp,
          otpSessionToken,
          user.id,
        ],
      );

      await transporter.sendMail({
        from: {
          name: "Modern Phonebook",
          address: process.env.NODEMAILER_EMAIL_ADDRESS,
        },
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
      });

      return res.json({ message: "OTP re-sent. Please verify your email." });
    }

    // New signup
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await db.query(
      `INSERT INTO users (first_name, other_names, email, user_password, provider, otp_code, otp_expires_at, otp_session_token, is_verified)
       VALUES (?, ?, ?, ?, 'local', ?, NOW() + INTERVAL 10 MINUTE, ? , FALSE)`,
      [first_name, other_names, email, hashedPassword, otp, otpSessionToken],
    );

    await transporter.sendMail({
      from: {
        name: "Modern Phonebook",
        address: process.env.NODEMAILER_EMAIL_ADDRESS,
      },
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    return res.status(200).json({
      message: "OTP sent. Please verify your email.",
      otpSessionToken,
    });
  } catch (err) {
    console.error("Error in signup:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = signUp;
