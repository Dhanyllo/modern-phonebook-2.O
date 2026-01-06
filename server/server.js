const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
const signup = require("./routes/signup.js");
const verify_otp = require("./routes/verify-otp.js");
const reset_otp = require("./routes/reset-otp.js");
const refresh_token = require("./routes/refresh-token.js");
const googleAuth = require("./routes/googleAuth.js");
const login = require("./routes/login.js");
const logout = require("./routes/logout.js");
const change_password = require("./routes/change-password.js");
const forgot_password = require("./routes/forgot-password.js");
const homepage = require("./routes/contactsRoutes/homepage.js");
const favourite = require("./routes/contactsRoutes/favourites.js");
const card_details = require("./routes/contactsRoutes/card-details.js");
const contacts_CRUD = require("./routes/contactsRoutes/contacts-CRUD.js");
const profile_update = require("./routes/profile-update.js");
const profile_fetch = require("./routes/profile-fetch.js");
const auth_check = require("./routes/auth-check.js");
const verifyJWT = require("./middleware/verifyJWT.js");
const corsOptions = require("./config/corsConfig.js");

app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Public routes (no JWT required)
app.use("/", signup);
app.use("/", verify_otp);
app.use("/", reset_otp);
app.use("/", refresh_token);
app.use("/", googleAuth);
app.use("/", login);
app.use("/api/auth", logout);
app.use("/", forgot_password);

// Applying verifyJWT for all routes after this point
app.use(verifyJWT);

// Protected routes
app.use("/", homepage);
app.use("/", change_password);
app.use("/", favourite);
app.use("/", card_details);
app.use("/", profile_update);
app.use("/", profile_fetch);
app.use("/", auth_check);
app.use("/", contacts_CRUD);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
