const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;

const listingSchema=new Schema(
    {
        title:{type:String, required:true},
        description:{type:String, required:true},
        images:{
            type:String, 
            default:"https://images.unsplash.com/photo-1519681393784-d120267933ba",
            set: (v)  => v ==="" ? "https://images.unsplash.com/photo-1519681393784-d120267933ba"
             : v
        },
        location:{type:String, required:true},
        price:{type:Number, required:true},
        country:{type:String, required:true},
        reviews:[
            {
                type:Schema.Types.ObjectId,
                ref:"Review"
            }
        ],
    }
);
listingSchema.post("findOneAndDelete",async(doc)=>{
    if(doc){
        await review.deleteMany({
            _id:{$in:doc.reviews}
        })
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;