var mongoose = require("mongoose");



//Mongoose Config
var bookSchema = new mongoose.Schema({
    image : String,
    title : String,
    author : String,
    publisher : Array,
    description : String,
    reviews: [
        {
            type:mongoose.Schema.Types.ObjectId ,
            ref:"Review"
        }
    ],
    Creator: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        Name : String
}
});
module.exports = mongoose.model("Book" , bookSchema);
