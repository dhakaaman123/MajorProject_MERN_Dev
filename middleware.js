const Listing = require("./models/listing.js");
const {listingSchema} = require("./Schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./Schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You need to be Logged in");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.ValidateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(404,errMsg);
    
        }
        else{
            next();
        }

}
module.exports.isOwner = async(req,res,next)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id);
    if(!res.locals.currUser || !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to edit this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.ValidateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);
  
    }
    else{
        next();
    }
  };
  module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not authorized to Delete this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

   