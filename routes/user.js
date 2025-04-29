const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// Signup form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Signup logic
router.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });
    } catch (err) {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

// Login form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Login logic
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
    (req, res) => {
        req.flash("success", `Welcome back to WanderLust, ${req.user.username}! Your next adventure awaits.`);
        
      
        res.redirect( res.locals.redirectUrl || "/listings");
    }
);

// Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);  // Handle any errors during logout
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");  // Redirect to listings page after logout
    });
});

module.exports = router;

