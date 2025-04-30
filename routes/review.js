const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const reviewController = require("../controller/reviews.js");

const {ValidateReview, isLoggedIn,isReviewAuthor } = require("../middleware.js");



// Schema Validation maintaine by JOi


router.post("/",isLoggedIn, ValidateReview , wrapAsync (reviewController.createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor ,wrapAsync(reviewController.deleteReview));

module.exports= router;