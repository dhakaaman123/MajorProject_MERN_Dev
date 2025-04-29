const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
 const {ValidateListing} = require("../middleware.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const mongoose = require("mongoose"); // 





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

    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");;
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");  // Add return here to stop execution
    }
    // console.log(listing);

    res.render("./listings/show.ejs", { listing });
}));

router.post("/", ValidateListing, wrapAsync (
    async(req,res,next)=>{
            let newlisting = new Listing ( req.body.listing);
            newlisting.owner = req.user._id;
            await newlisting.save();
            req.flash("success","New listing Created");
            res.redirect("/listings");
           
    }
))

// editing existing listing

router.get("/:id/edit", isOwner, wrapAsync(
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

router.delete("/:id",isLoggedIn, isOwner,wrapAsync(async (req,res)=>{
    const {id}= req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success","listing is Deleted");
     res.redirect("/listings");
    
}) );

// put request for Editing a post

router.put("/:id", isLoggedIn,isOwner,ValidateListing, wrapAsync(async(req,res)=>{

 
    const {id}= req.params;
    let listing = await Listing.findById(id);
   

    let updateListing=  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," listing is Updated ");
    res.redirect(`/listings/${id}`);
    // console.log(updateListing);
      

}));

module.exports = router; 
