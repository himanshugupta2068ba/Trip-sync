const express=require("express");
const router=express.Router();
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const { validateListing, validateReview } = require("../middleware");

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg=error.details[0].map((el)=>el.message).join(",");
        throw new ExpressError(errMsg,400);
    }
    else{
        next();
    }
};

router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}));

//new routes
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");     
})

//show routes
router.get("/:id",wrapAsync(async (req,res)=>{
    const listing=await Listing.findById(req.params.id).populate("reviews");
    if(!listing){
        return res.status(404).send("Listing not found");
    }
    res.render("listings/show.ejs",{listing});
}));

//create route
router.post("/",
    validateListing,
    wrapAsync(async(req,res,next)=>{
    const newListing=new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings");
}))
   
//edit route
router.get("/:id/edit",
    validateListing,
    wrapAsync(async(req,res)=>{
    const listing=await Listing.findById(req.params.id);
    res.render("listings/edit.ejs",{listing});
}))
//update route
router.put("/:id",
    validateListing,
    wrapAsync(async(req,res)=>{
    const listing=await Listing.findByIdAndUpdate(req.params.id,{...req.body.listing});
    res.redirect("/listings/"+listing._id);
}))
//delete
router.delete("/:id",
    validateListing,
    wrapAsync(async(req,res)=>{
    const listing=await Listing.findByIdAndDelete(req.params.id);
    res.redirect("/listings");
}))

//reviews

module.exports=router;