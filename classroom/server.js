const express = require("express");
const app = express();
const session = require("express-session");
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const flash = require("connect-flash");
app.use(session({secret:"mysupersecretstring",resave:false,saveUninitialized:true}));
app.use(flash()); 
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))

app.use((req,res,next)=>{
    res.locals.succesmsg = req.flash("success");
    res.locals.errormsg = req.flash("error");
    next();
})




app.get("/test",(req,res)=>{
    res.send("test successful!");
})

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;

    }else{
        req.session.count=1;
    }
    res.send(`you sent a request ${req.session.count} times`);
})
app.get("/register",(req,res)=>{
    let {name="anonymous"}= req.query;
    req.session.name = name;
    if(name =="anonymous"){
        req.flash("error","user doesn't registered");

    }else{
        req.flash('success',"user registered successfully");
    }
  
    res.redirect("/hello");
   
})

app.get("/hello",(req,res)=>{
   
    res.render("page.ejs",{name:req.session.name});   
}) 





app.listen(3000,()=>{
    console.log("server is running on the port 3000");
});
