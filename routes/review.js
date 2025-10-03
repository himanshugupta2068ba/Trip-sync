const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Review=require("../model/review.js");
const Listing=require("../model/listing.js");
const {isLoggedIn, isOwner,validateReview,isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/reviews");

//post review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.post));

//delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.delete));
module.exports=router;