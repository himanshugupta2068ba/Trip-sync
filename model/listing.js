const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;

const listingSchema=new Schema(
    {
        title:{type:String, required:true},
        description:{type:String, required:true},
        images:{
           url:{type:String},
           filename:{type:String}
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
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
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