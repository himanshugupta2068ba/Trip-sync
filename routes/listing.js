const express=require("express");
const router=express.Router();
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");


router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new routes
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
       
})

//show routes
router.get("/:id",wrapAsync(async (req,res)=>{
    const listing=await Listing.findById(req.params.id).populate({path:"reviews",populate:{
        path:"author"}
    }).populate("owner");
    // console.log(listing);
     if(!listing){
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
    else{
    res.render("listings/show.ejs",{listing});
    }
}));

//create route
router.post("/",
    validateListing,
    isLoggedIn,
    wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","Listing added successfully");
    res.redirect("/listings");
}))
   
//edit route
router.get("/:id/edit",
    isLoggedIn,isOwner,
    validateListing,
    wrapAsync(async(req,res)=>{
    const listing=await Listing.findById(req.params.id);
  if(!listing){
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
    else{
    res.render("listings/edit.ejs",{listing});
    }
}))
//update route
router.put("/:id",
    isLoggedIn,isOwner,
    validateListing,
    wrapAsync(async(req,res)=>{      
    const listing=await Listing.findByIdAndUpdate(req.params.id,{...req.body.listing});
    req.flash("success","Listing updated successfully");
    res.redirect("/listings/"+listing._id);
}))
//delete
router.delete("/:id",
    isLoggedIn,isOwner,
    validateListing,
    wrapAsync(async(req,res)=>{
    const listing=await Listing.findByIdAndDelete(req.params.id);
       req.flash("success","Listing deleted successfully");
    res.redirect("/listings");
}))



module.exports=router;