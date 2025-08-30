const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./model/listing.js");
const path=require("path")
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
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
app.use(express.static(path.join(__dirname,"public")))

app.get("/",(req,res)=>{
    res.send("Hello World");
});


app.get("/listing",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

//new routes
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//show routes
app.get("/listing/:id",async (req,res)=>{
    const listing=await Listing.findById(req.params.id);
    if(!listing){
        return res.status(404).send("Listing not found");
    }
    res.render("listings/show.ejs",{listing});
});

//create route
app.post("/listings",async(req,res)=>{
    const newListing=new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listing");
})
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    const listing=await Listing.findById(req.params.id);
    if(!listing){
        return res.status(404).send("Listing not found");
    }
    res.render("listings/edit.ejs",{listing});
})
//update route
app.put("/listings/:id",async(req,res)=>{
    const listing=await Listing.findByIdAndUpdate(req.params.id,{...req.body.listing});
    if(!listing){
        return res.status(404).send("Listing not found");
    }
    res.redirect("/listing/"+listing._id);
})
//delete
app.delete("/listings/:id",async(req,res)=>{
    const listing=await Listing.findByIdAndDelete(req.params.id);
    if(!listing){
        return res.status(404).send("Listing not found");
    }
    res.redirect("/listing");
})
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
app.listen(8000,()=>{
    console.log("Server is running on port 8000");
})