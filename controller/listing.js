const Listing = require("../models/listing.js");
const mongoose = require("mongoose");

module.exports.index = async (req, res) => {
    const allListingsRaw = await Listing.find({})
        .populate({ path: "reviews", select: "rating" });

    // Calculate average rating for each listing

    const allListings = allListingsRaw.map(listing => {
        const total = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = listing.reviews.length ? (total / listing.reviews.length).toFixed(1) : null;
    
        return {
            ...listing.toObject(),
            averageRating: avgRating
        };
    });
    

    res.render("./listings/index.ejs", { allListings });
};

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid Listing ID");
        return res.redirect("/listings");
    }

    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }

    // Calculate average rating for show page
    let averageRating = 0;
    if (listing.reviews.length > 0) {
        const totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = totalRating / listing.reviews.length;
    }

    res.render("./listings/show.ejs", { listing, averageRating: averageRating.toFixed(1) });
};

module.exports.renderNewListingForm = (req, res) => {
    try {
        res.render("listings/new");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.renderEditListingForm = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250")
    res.render("./listings/edit.ejs", { listing,originalImageUrl });
};

module.exports.createListing = async (req, res, next) => {
    // let url = req.file.path;
    // let filename = req.file.filename;
    let newlisting = new Listing(req.body.listing);

    if (req.file) {
    
        newlisting.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    newlisting.owner = req.user._id;
   
    await newlisting.save();
    req.flash("success", "New listing Created");
    res.redirect("/listings");
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
 await Listing.findByIdAndDelete(id);
    req.flash("success", "listing is Deleted");
    res.redirect("/listings");
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params; 
    
    let listing =   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
            
        };
        await listing.save();
    }
    
    req.flash("success", "Listing is Updated");
    res.redirect(`/listings/${id}`);
};
