const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");

const users = require("./routes/user.js");
const posts = require("./routes/post.js");


app.use(cookieparser("secretcode"));
app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("hii iam root");
})

app.get("/getsingnedcookie",(req,res)=>{
    res.cookie("made-in","India",{signed:true});
    res.send("singed cookie send");

})

app.get("/verfy",(req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
})

app.get("/greet",(req,res)=>{
    let {name="anonymous"}= req.cookies;
    res.send(`hii ${name}`);
})

app.get("/getcookies",(req,res)=>{
    res.cookie("greet","hello");
    res.cookie("name","Aman")
    res.send("hii this is demo msg for cookie");
})


//USER
app.use("/users",users);
app.use("/posts",posts);

// Index-user


 //POST











app.listen(3000,()=>{
    console.log("server is running on the port 3000");
});
