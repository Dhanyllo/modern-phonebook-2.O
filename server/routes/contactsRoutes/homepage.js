const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  searchContacts,
} = require("../../controllers/homepageControllers.js");

router.get("/", getAllContacts);

router.get("/search/home", searchContacts);

module.exports = router;
