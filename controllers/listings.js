const Listing=require("../model/listing");
const { geocodeAddress } = require('../utils/geocoder');

module.exports.home=(req,res)=>{
    res.render("landing/home.ejs");
}

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
// 

module.exports.create = async (req, res, next) => {
  try {
    // Extract uploaded image info if available
    let url = req.file ? req.file.path : null;
    let filename = req.file ? req.file.filename : null;

    // Build listing from request body
    const listingData = { ...req.body.listing };
    listingData.owner = req.user._id;

    // Attach image if uploaded
    if (url && filename) {
      listingData.images = { url, filename };
    }

    // Build address string for geocoding
    const address = `${listingData.street || ''} ${listingData.city || ''} ${listingData.state || ''} ${listingData.country || ''}`.trim();

    // Try to geocode
    const coords = await geocodeAddress(address);
    if (coords) {
      listingData.geometry = { type: 'Point', coordinates: [coords.lng, coords.lat] };
      listingData.location = coords.display_name || address;
    } else {
      // fallback if geocoding fails
      listingData.location = address || 'Unknown location';
      // Optional: set default coordinates
      listingData.geometry = { type: 'Point', coordinates: [78.9629, 20.5937] }; // center of India
    }

    // Create and save the listing
    const newListing = new Listing(listingData);
    await newListing.save();

    req.flash("success", "Listing added successfully");
    res.redirect("/listings");

  } catch (e) {
    console.error(e);
    req.flash("error", "Failed to create listing. Please try again.");
    res.redirect("/listings/new");
  }
};

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
module.exports.update = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

   const oldAddress = `${listing.street || ''} ${listing.city || ''} ${listing.state || ''} ${listing.country || ''}`.trim();
Object.assign(listing, req.body.listing);
const newAddress = `${listing.street || ''} ${listing.city || ''} ${listing.state || ''} ${listing.country || ''}`.trim();
console.log(newAddress, oldAddress);
    if (newAddress && newAddress !== oldAddress) {
      const coords = await geocodeAddress(newAddress);
      if (coords) {
        listing.geometry = { type: "Point", coordinates: [coords.lng, coords.lat] };
        listing.location = newAddress;
      } else {
        listing.location = newAddress;
      }
    }

    // handle image update if file uploaded
    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.images = { url, filename };
    }

    await listing.save();
console.log(listing);
    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update listing");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

// module.exports.update=async(req,res)=>{      

//     const listing=await Listing.findByIdAndUpdate(req.params.id,{...req.body.listing});
//    if(typeof req.file!=="undefined"){
//     let url=req.file.path;   
//     let filename=req.file.filename;
//     listing.images={url,filename};
//     await listing.save();
//    }
//     req.flash("success","Listing updated successfully");
//     res.redirect("/listings/"+listing._id);
// }
module.exports.delete=async(req,res)=>{
    const listing=await Listing.findByIdAndDelete(req.params.id);
       req.flash("success","Listing deleted successfully");
    res.redirect("/listings");
}

// controllers/listingController.js
module.exports.categoryFilter = async (req, res) => {
  const { category } = req.params;
  // Optional: Validate against allowed categories
  const allowedCategories = [
    'Trending','Rooms','Iconic Cities','Mountains','Castles','Beaches','Campground',
    'Farms','Arctic','Resorts','Forest Stay','Lake View','Heritage','Adventure'
  ];
  if (!allowedCategories.includes(category)) {
    req.flash('error', 'Invalid category selected');
    return res.redirect('/listings');
  }

  const filteredListings = await Listing.find({ category });
  res.render("listings/category.ejs", { filteredListings, category });
};

module.exports.searchResults = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === '') {
    req.flash('error', 'Please enter a search term');
    return res.redirect('/listings');
  }
  const regex = new RegExp(q, 'i'); // case-insensitive search
  const searchResults = await Listing.find({
    $or: [
      { title: regex },
      { description: regex },
      { location: regex },
      { category: regex }
    ]
  });
  res.render("listings/search.ejs", { searchResults, query: q });
}