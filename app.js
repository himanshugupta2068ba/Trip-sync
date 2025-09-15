const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./model/listing.js");
const path=require("path")
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review=require("./model/review.js");
const listings=require("./routes/listing.js");
// const review = require("./model/review.js");
const reviews=require("./routes/review.js");

// const { reviewSchema } = require("./schema.js");
exports.MONGO_URL = MONGO_URL;
// Connect to MongoDB
main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.error("Error connecting to MongoDB:", error);
});

async function main() {
    await mongoose.connect(MONGO_URL)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.get("/",(req,res)=>{
    res.send("Hello World");
});


// const validateListing = (req,res,next) => {
//     let {error} = listingSchema.validate(req.body);
//     if (error) {
//         let errMsg=error.details[0].map((el)=>el.message).join(",");
//         throw new ExpressError(errMsg,400);
//     }
//     else{
//         next();
//     }
// };
// const validateReview = (req,res,next) => {
//     let {error} = reviewSchema.validate(req.body);
//     if (error) {
//         let errMsg=error.details[0].map((el)=>el.message).join(",");
//         throw new ExpressError(errMsg,400);
//     }
//     else{
//         next(); 
//     }
// }

// app.get("/listings",wrapAsync(async (req,res)=>{
//     const allListings=await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// }));

// //new routes
// app.get("/listings/new",(req,res)=>{
//     res.render("listings/new.ejs");     
// })

// //show routes
// app.get("/listings/:id",wrapAsync(async (req,res)=>{
//     const listing=await Listing.findById(req.params.id).populate("reviews");
//     if(!listing){
//         return res.status(404).send("Listing not found");
//     }
//     res.render("listings/show.ejs",{listing});
// }));

// //create route
// app.post("/listings",
//     validateListing,
//     wrapAsync(async(req,res,next)=>{
//     const newListing=new Listing(req.body.listing)
//     await newListing.save();
//     res.redirect("/listings");
// }))
   
// //edit route
// app.get("/listings/:id/edit",
//     validateListing,
//     wrapAsync(async(req,res)=>{
//     const listing=await Listing.findById(req.params.id);
//     res.render("listings/edit.ejs",{listing});
// }))
// //update route
// app.put("/listings/:id",
//     validateListing,
//     wrapAsync(async(req,res)=>{
//     const listing=await Listing.findByIdAndUpdate(req.params.id,{...req.body.listing});
//     res.redirect("/listings/"+listing._id);
// }))
// //delete
// app.delete("/listings/:id",
//     validateListing,
//     wrapAsync(async(req,res)=>{
//     const listing=await Listing.findByIdAndDelete(req.params.id);
//     res.redirect("/listings");
// }))

// //reviews
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//     let listing=await Listing.findById(req.params.id);
//     let review=new Review(req.body.review);
//     listing.reviews.push(review);
//     await listing.save();
//     await review.save();
//     res.redirect("/listings/"+listing._id);
// }));

// //delete review
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     const {id,reviewId}=req.params;
//     let listing=await Listing.findById(id);
//     listing.reviews.pull(reviewId);
//     await listing.save();
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect("/listings/"+listing._id);
// }));

// app.get("/textListing",async(req,res)=>{
//     const sample=new Listing({
//         title:"Beautiful Beach House",
//         description:"A stunning beach house with ocean views.",
//         images:"https://example.com/image.jpg",
//         location:"Malibu, CA",
//         price:500,
//         country:"USA"
//     });
//       await sample.save();
//       console.log("sample");
//       res.send("successful")

// })
// app.all("*",(req,res,next)=>{
//     throw new ExpressError("Page Not Found",404);
// })
app.use((error,req,res,next)=>{
    console.error(error);
    let {statusCode=500,message="Something went wrong"}=error;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{message});
})

app.listen(8000,()=>{
    console.log("Server is running on port 8000");
})