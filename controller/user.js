const User = require("../models/user.js");
module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.createUser = async (req, res) => {
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
};
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.LoginUser = (req, res) => {
    req.flash("success", `Welcome back to WanderLust, ${req.user.username}! Your next adventure awaits.`);
    
  
    res.redirect( res.locals.redirectUrl || "/listings");
};
module.exports.LogoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);  // Handle any errors during logout
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");  // Redirect to listings page after logout
    });
}



