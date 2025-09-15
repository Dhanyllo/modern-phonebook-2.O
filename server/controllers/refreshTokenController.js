const express = require("express");
const bcrypt = require("bcrypt");
const DatabaseConnection = require("../config/config.js");
const jwt = require("jsonwebtoken");

db = DatabaseConnection();

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    let decodedPayload;
    try {
      decodedPayload = jwt.decode(refreshToken);
      if (!decodedPayload?.id) {
        return res.status(403).json({ message: "Invalid token payload" });
      }
    } catch (err) {
      return res.status(403).json({ message: "Malformed refresh token" });
    }

    const [rows] = await db.query(
      `SELECT refresh_token, email FROM users WHERE id = ?`,
      [decodedPayload.id]
    );

    const user = rows[0];
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refresh_token);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    let verified;
    try {
      verified = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res
        .status(403)
        .json({ message: "Expired or invalid refresh token" });
    }

    // Issue a new access token
    const newAccessToken = jwt.sign(
      { id: verified.id, email: verified.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Store access token in HttpOnly cookie
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.json({ success: true, message: "Access token refreshed" });
  } catch (err) {
    console.error("Error in refresh-token route:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = refreshToken;
