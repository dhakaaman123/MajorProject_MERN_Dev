const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./Schema.js");
app.use(methodOverride('_method'));
main()
.then(()=>{
    console.log("Connected to mongodb sucessfully");
})
.catch((err)=>{
    console.log(err);

})
async function  main () {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs" ,ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res)=>{
    res.send("hii iam root");
});


// Schema Validation maintaine by JOi
const ValidateListing = (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errMsg);

    }
    else{
        next();
    }
}

app.get("/listings", wrapAsync(
    async(req,res)=>{
        const allListings= await Listing.find({});
        res.render("./listings/index.ejs",{allListings});
    }
));

app.get("/listings/new", (req, res) => {
    try {
        res.render("listings/new");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/listings/:id", wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
   

}))

app.post("/listings", ValidateListing, wrapAsync (
    async(req,res,next)=>{



            let newlisting = new Listing ( req.body.listing);
            await newlisting.save();
            res.redirect("/listings");
           
    }
))

app.get("/listings/:id/edit", wrapAsync(
    async (req,res)=>{
        const {id}= req.params;
          
          let listing=await Listing.findById(id);
        
          res.render("./listings/edit.ejs",{listing});
        
    
    
    }
))



app.put("/listings/:id", ValidateListing, wrapAsync(async(req,res)=>{

 
    const {id}= req.params;

    let updateListing=  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
    // console.log(updateListing);
      

}));

app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    const {id}= req.params;
      await Listing.findByIdAndDelete(id);
     res.redirect("/listings");
    
}) )




// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",

//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");

// })

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{

    let {statusCode=500 ,message="Something Went wrong"}= err;
    res.render("error",{message});
});

app.listen(port , ()=>{
    console.log(`server connected to localhost ${port}`)

})
