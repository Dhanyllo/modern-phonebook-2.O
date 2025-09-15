const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
const DatabaseConnection = require("./config/config.js");
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
const verifyJWT = require("./middleware/verifyJWT.js");

app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = DatabaseConnection();

app.use("/", signup);
app.use("/", verify_otp);
app.use("/", reset_otp);
app.use("/", refresh_token);
app.use("/", googleAuth);
app.use("/", login);
app.use("/", change_password);
app.use("/", forgot_password);
app.use("/", logout);
app.use("/", homepage);
app.use("/", favourite);
app.use("/", card_details);

app.use(verifyJWT);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
