const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  console.log("inside the verifier");

  // Get access token from cookie
  const token = req.cookies?.access_token;
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403);
    }

    // Attach decoded data to request
    req.user = { id: decoded.id, email: decoded.email };

    console.log("done verifying");
    next();
  });
};

module.exports = verifyJWT;
