const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');

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


app.get("/",(req,res)=>{
    res.send("hii iam root");
})

app.get("/listings",async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});

app.get("/listings/new", (req, res) => {
    try {
        res.render("listings/new");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});

})

app.post("/listings",async(req,res)=>{
    let newlisting = new Listing ( req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
   

})

app.get("/listings/:id/edit",async (req,res)=>{
    const {id}= req.params;
      
      let listing=await Listing.findById(id);
      res.render("./listings/edit.ejs",{listing});


})



app.put("/listings/:id", async(req,res)=>{
    const {id}= req.params;

    let updateListing=  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
    // console.log(updateListing);
      

});

app.delete("/listings/:id",async (req,res)=>{
    const {id}= req.params;
      await Listing.findByIdAndDelete(id);
     res.redirect("/listings");
    
})




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

app.listen(port , ()=>{
    console.log(`server connected to localhost ${port}`)

})
