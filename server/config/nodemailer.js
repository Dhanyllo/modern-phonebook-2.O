const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  // service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.NODEMAILER_EMAIL_ADDRESS,
    pass: process.env.APP_PASSWORD,
  },
});

module.exports = transporter;
