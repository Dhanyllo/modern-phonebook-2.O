const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const DatabaseConnection = require("../config/config.js");

db = DatabaseConnection();

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 1. Fetch user
    const [rows] = await db.query(
      "SELECT user_password, provider FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = rows[0];

    // Prevent change if Google/Apple user
    if (user.provider !== "local") {
      return res.status(400).json({
        success: false,
        message: "Password change not allowed for social logins",
      });
    }

    // 2. Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.user_password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }

    // 3. Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update DB
    await db.query("UPDATE users SET user_password = ? WHERE id = ?", [
      hashedNewPassword,
      userId,
    ]);

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = changePassword;
