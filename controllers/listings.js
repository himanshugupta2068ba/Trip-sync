const Listing=require("../model/listing");
module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}
module.exports.new=(req,res)=>{
    res.render("listings/new.ejs");
       
}
module.exports.show=async (req,res)=>{
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
}
module.exports.create=async(req,res,next)=>{
    const newListing=new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","Listing added successfully");
    res.redirect("/listings");
}
module.exports.edit=async(req,res)=>{
    const listing=await Listing.findById(req.params.id);
  if(!listing){
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
    else{
    res.render("listings/edit.ejs",{listing});
    }
}
module.exports.update=async(req,res)=>{      
    const listing=await Listing.findByIdAndUpdate(req.params.id,{...req.body.listing});
    req.flash("success","Listing updated successfully");
    res.redirect("/listings/"+listing._id);
}
module.exports.delete=async(req,res)=>{
    const listing=await Listing.findByIdAndDelete(req.params.id);
       req.flash("success","Listing deleted successfully");
    res.redirect("/listings");
}