const express=require("express");
const app=express();
const router=express.Router({mergeParams:true});

//posts
//index 
router.get("/",(req,res)=>{
    res.send("GET for posts");
})
//show-users
router.get("/:id",(req,res)=>{
    res.send("Get for show posts");
})

//post routes
router.post("/",(req,res)=>{
    res.send("POST ")
})

//delete posts
router.delete("/:id",(req,res)=>{
    res.send("Delete for posts")
})
module.exports=router;