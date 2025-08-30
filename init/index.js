const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../model/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.error("Error connecting to MongoDB:", error);
});
async function main() {
    await mongoose.connect(MONGO_URL)
}

const initDB=async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initiallised");
}
initDB();
