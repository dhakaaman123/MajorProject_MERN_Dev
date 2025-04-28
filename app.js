const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./Schema.js");
const Review = require("./models/review.js");
const {reviewSchema} = require("./Schema.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const userRouter = require("./routes/user.js");
const listingRouter = require("./routes/listting.js");
const reviewsRouter= require("./routes/review.js");




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

const sessionOptions = {
    secret: "mySuperSecretString",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
    
};
app.get("/",(req,res)=>{
    res.send("hii iam root");
});


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/",userRouter);
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
// app.get("/deompuser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"AmanDhaka",

//     });
//    let registeredUser =  await User.register(fakeUser,"helloworld");
//    res.send(registeredUser);

// })








app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{

    let {statusCode=500 ,message="Something Went wrong"}= err;
    res.render("error",{err});
});

app.listen(port , ()=>{
    console.log(`server connected to localhost ${port}`)

})
