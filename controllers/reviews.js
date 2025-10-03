const Review=require("../model/review.js");
const Listing=require("../model/listing.js");

module.exports.post=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let review=new Review(req.body.review);
    review.author=req.user._id;
    console.log(review);
    listing.reviews.push(review);
    await listing.save();
    await review.save();
       req.flash("success","review added successfully");
    res.redirect("/listings/"+listing._id);
}

module.exports.delete=async(req,res)=>{
    const {id,reviewId}=req.params;
    let listing=await Listing.findById(id);
    listing.reviews.pull(reviewId);
    await listing.save();
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully");
    res.redirect("/listings/"+listing._id);
}