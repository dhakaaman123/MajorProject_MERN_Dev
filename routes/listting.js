const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
 const {ValidateListing} = require("../middleware.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const mongoose = require("mongoose"); // 
const listingController = require("../controller/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});








// get all listings 

router.route("/")
    .get( wrapAsync(listingController.index))
    .post( isLoggedIn,upload.single('listing[image]'),ValidateListing, wrapAsync (listingController.createListing));
  



router.route("/new")
.get(isLoggedIn, listingController.renderNewListingForm);

router.route("/:id")
 .get( wrapAsync(listingController.showListing))
 .delete(isLoggedIn, isOwner,wrapAsync(listingController.deleteListing) )
 .put(isLoggedIn,isOwner,upload.single('listing[image]'),ValidateListing, wrapAsync(listingController.updateListing));

 router.route("/:id/edit")
.get( isOwner, wrapAsync(listingController.renderEditListingForm));

// Adding new listing


//posting new listing




// show specific listing





// editing existing listing



// Deleting existing listing



// put request for Editing a post


module.exports = router; 
