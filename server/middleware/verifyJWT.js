const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res
      .status(401)
      .json({ authenticated: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ authenticated: false, message: "Invalid or expired token" });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      first_name: decoded.first_name,
      other_names: decoded.other_names,
    };

    next();
  });
};

module.exports = verifyJWT;
