var mongoose = require("mongoose");
var reviewSchema = new mongoose.Schema({
    Author: String , 
    Review: String , 
    CreatedDate : {type:Date , default:Date.now},
    Creator: {
                id:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User"
                },
                Name : String
    }
});
module.exports = mongoose.model("Review" , reviewSchema);