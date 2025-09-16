const express=require("express");
const app=express();
const router=express.Router({mergeParams:true});
//index - users
router.get("/",(req,res)=>{
    res.send("GET for users");
})
//show-users
router.get("/:id",(req,res)=>{
    res.send("Get for show users");
})

//post routes
router.post("",(req,res)=>{
    res.send("POST ")
})

//delete user
router.delete("/:id",(req,res)=>{
    res.send("Delete for users")
})
module.exports=router;