const DatabaseConnection = require("../config/config.js");
db = DatabaseConnection();

const profileUpdate = async (req, res) => {
  try {
    const userId = req.user?.id; // From JWT middleware
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let { first_name, other_names, email } = req.body;

    // Normalize inputs
    if (first_name) {
      first_name = first_name
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    if (other_names) {
      other_names = other_names
        .trim()
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    if (email) {
      email = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email format" });
      }
    }

    // Fetch current user
    const [rows] = await db.query(
      "SELECT id, first_name, other_names, email, pending_email, provider FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const currentUser = rows[0];

    // Prevent social login users from changing email
    if (
      currentUser.provider !== "local" &&
      email &&
      email !== currentUser.email
    ) {
      return res.status(400).json({
        success: false,
        message: "Email change not allowed for social login users",
      });
    }

    // Build update object only if values actually changed
    const updates = {};

    if (first_name && first_name !== currentUser.first_name) {
      updates.first_name = first_name;
    }

    if (other_names && other_names !== currentUser.other_names) {
      updates.other_names = other_names;
    }

    if (email && email !== currentUser.email) {
      // Ensure new email is unique (check against both `email` and `pending_email`)
      const [emailCheck] = await db.query(
        "SELECT id FROM users WHERE email = ? OR pending_email = ?",
        [email, email]
      );
      if (emailCheck.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }

      // Generate OTP for new email
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      updates.pending_email = email;
      updates.pending_email_otp = otp;
      updates.pending_email_expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

      // Send OTP
      await transporter.sendMail({
        from: {
          name: "Modern Phonebook",
          address: process.env.NODEMAILER_EMAIL_ADDRESS,
        },
        to: email,
        subject: "Verify Your New Email",
        text: `Your OTP to confirm your new email is: ${otp}`,
      });
    }

    if (Object.keys(updates).length === 0) {
      return res.json({ success: true, message: "No changes applied" });
    }

    // Single UPDATE query
    await db.query("UPDATE users SET ? WHERE id = ?", [updates, userId]);

    res.json({
      success: true,
      message:
        email && email !== currentUser.email
          ? "Profile updated. Verify your new email to complete the change. You can still log in with your old email until verification is done."
          : "Profile updated successfully.",
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = profileUpdate;
