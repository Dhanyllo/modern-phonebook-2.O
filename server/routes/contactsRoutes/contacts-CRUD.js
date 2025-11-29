const express = require("express");
const upload = require("../../middleware/upload");
const {
  createContact,
  updateContact,
  deleteContact,
} = require("../../controllers/contactControllers.js");

const router = express.Router();

router.post("/contacts", upload.single("contactImage"), createContact); // Create contact
router.put("/contacts/:id", upload.single("contactImage"), updateContact); // Update contact
router.delete("/contacts/:id", deleteContact);
module.exports = router;
