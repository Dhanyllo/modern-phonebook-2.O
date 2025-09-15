const express = require("express");
const router = express.Router();
const {
  getContactDetails,
  fetchOccupations,
} = require("../../controllers/detailCardControllers.js");

router.get("/detail/occupations/:id", fetchOccupations);

router.get("/detail/:id", getContactDetails);

module.exports = router;
