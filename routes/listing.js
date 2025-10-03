const express=require("express");
const router=express.Router();
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })
const listingController= require("../controllers/listings");

//create route and get route
router
   .route("/")
   .get(wrapAsync(listingController.index))
   .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.create)
)

//new routes
router.get("/new",isLoggedIn,(listingController.new));

//show routes //delete //update route
router
   .route("/:id")
   .get(wrapAsync(listingController.show))
    .put(
    isLoggedIn,isOwner,
    validateListing,
    wrapAsync(listingController.update))
    .delete(
    isLoggedIn,isOwner,
    validateListing,
    wrapAsync(listingController.delete))




   
//edit route
router.get("/:id/edit",
    isLoggedIn,isOwner,
    validateListing,
    wrapAsync(listingController.edit))



module.exports=router;