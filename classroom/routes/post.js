const express = require("express");
const router = express.Router();
router.get("/",(req,res)=>{
    res.send("Get for posts ");
})
//show -user
router.get("/:id",(req,res)=>{
    res.send("Get for posts id");
})

//post-user
router.post("/",(req,res)=>{
    res.send("Post for posts");
})

// delete-user
router.delete("/:id",(req,res)=>{
    res.send(" Delete for posts id");
})
 module.exports= router;
