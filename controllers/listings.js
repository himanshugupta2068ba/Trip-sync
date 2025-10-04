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
   try{ let url=req.file.path;
    let filename=req.file.filename;
    // console.log(req.file);
    const newListing=new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner=req.user._id;
    newListing.images={url,filename};
    await newListing.save();
    req.flash("success","Listing added successfully");
    res.redirect("/listings");
   }catch(e){
    req.flash("error","Image upload failed");
    res.redirect("listings/new");
   }
}
module.exports.edit=async(req,res)=>{
    const listing=await Listing.findById(req.params.id);
  if(!listing){
        req.flash("error","Listing not found");
        res.redirect("/listings");
    }
    else{
        let originalImageUrl=listing.images.url;
        if(typeof req.file!=="undefined"){
         originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
        }
    res.render("listings/edit.ejs",{listing,originalImageUrl});
    }
}
module.exports.update=async(req,res)=>{      
    const listing=await Listing.findByIdAndUpdate(req.params.id,{...req.body.listing});
   if(typeof req.file!=="undefined"){
    let url=req.file.path;   
    let filename=req.file.filename;
    listing.images={url,filename};
    await listing.save();
   }
    req.flash("success","Listing updated successfully");
    res.redirect("/listings/"+listing._id);
}
module.exports.delete=async(req,res)=>{
    const listing=await Listing.findByIdAndDelete(req.params.id);
       req.flash("success","Listing deleted successfully");
    res.redirect("/listings");
}