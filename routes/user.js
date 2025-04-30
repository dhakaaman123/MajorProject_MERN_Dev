const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

// Signup form

router.route("/signup")
    .get(userController.renderSignUpForm )
    .post( userController.createUser);


// Signup logic

router.route("/login")
    .get( userController.renderLoginForm)
    .post(
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
    userController.LoginUser
    );

// Logout
router.get("/logout", userController.LogoutUser);

module.exports = router;

