const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {ValidateReview, isLoggedIn,isReviewAuthor } = require("../middleware.js");



// Schema Validation maintaine by JOi


router.post("/",isLoggedIn, ValidateReview , wrapAsync (async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new Review saved");
    req.flash("success","Review is Created");
    res.redirect(`/listings/${req.params.id}`);

}))

router.delete("/:reviewId",isLoggedIn,isReviewAuthor ,wrapAsync(async(req,res)=>{
    const {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is Deleted");
    res.redirect(`/listings/${id}`);

    
}))

module.exports= router;