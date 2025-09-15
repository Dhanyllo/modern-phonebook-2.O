const express = require("express");
const {
  getAllFavouriteContacts,
  searchFavouriteContacts,
  favouriteExistStatus,
  setFavourite,
} = require("../../controllers/favouriteContactControllers.js");
const router = express.Router();

router.get("/favourites", getAllFavouriteContacts);

router.get("/search/favourites", searchFavouriteContacts);

router.get("/favstatus", favouriteExistStatus);

router.patch("/update/:id", setFavourite);

module.exports = router;
