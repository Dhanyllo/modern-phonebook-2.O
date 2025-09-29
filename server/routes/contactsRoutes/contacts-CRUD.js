const express = require("express");
const {
  createContact,
  updateContact,
  deleteContact,
} = require("../../controllers/contactControllers.js");

const router = express.Router();

router.post("/contacts", createContact); // Create contact
router.put("/contacts/:id", updateContact); // Update contact
router.delete("/contacts/:id", deleteContact);
module.exports = router;
