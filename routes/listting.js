const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const mongoose = require("mongoose"); // 


const ValidateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);

    }
    else{
        next();
    }
}


// get all listings 

router.get("/", wrapAsync(
    async(req,res)=>{
        const allListings= await Listing.find({});
        res.render("./listings/index.ejs",{allListings});
    }
));

// Adding new listing

router.get("/new", isLoggedIn, (req, res) => {
    try {
   
        res.render("listings/new");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
//posting new listing




// show specific listing

router.get("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid Listing ID");
        return res.redirect("/listings");
    }

    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");  // Add return here to stop execution
    }

    res.render("./listings/show.ejs", { listing });
}));

router.post("/", ValidateListing, wrapAsync (
    async(req,res,next)=>{
            let newlisting = new Listing ( req.body.listing);
            await newlisting.save();
            req.flash("success","New listing Created");
            res.redirect("/listings");
           
    }
))

// editing existing listing

router.get("/:id/edit", wrapAsync(
    async (req,res)=>{
        const {id}= req.params;
          
          let listing=await Listing.findById(id);
          if(!listing){
            req.flash("error","Listing you requested for does not exist");
            res.redirect("/listing");
        }
        
          res.render("./listings/edit.ejs",{listing});
        
    
    
    }
))

// Deleting existing listing

router.delete("/:id",isLoggedIn, wrapAsync(async (req,res)=>{
    const {id}= req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success","listing is Deleted");
     res.redirect("/listings");
    
}) );

// put request for Editing a post

router.put("/:id", ValidateListing, isLoggedIn,wrapAsync(async(req,res)=>{

 
    const {id}= req.params;

    let updateListing=  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," listing is Updated ");
    res.redirect(`/listings/${id}`);
    // console.log(updateListing);
      

}));

module.exports = router;
