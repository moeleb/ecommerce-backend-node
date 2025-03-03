const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    description : {
        type:String,
        required:true
    },
    category: {
        type:String,
        required:true ,
    },
    numViews: {
        type:Number,
        default: 0
    },
    isLiked :{
        type:Boolean,
        default:false,
    },
    isDisliked: {
        type:Boolean,
        default:false
    }, 
    Likes : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    disLikes : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    image: {
        type:String,
        default: ""
    },
    author: {
        type:String,
        default: "Admin"
    },

}, {
    toJSON:{
        virtuals:true,    
    }, 
    toObject  : {
       virtuals :true 
    }, 
    timestamps:true
})


module.exports = mongoose.model("Blog",blogSchema)