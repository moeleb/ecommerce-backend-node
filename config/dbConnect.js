const mongoose = require("mongoose");
const dotenv = require("dotenv").config()

const dbConnect = () =>{
    mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("connected");
    }).catch((e)=>{
        console.log(e);
    })
}

module.exports = dbConnect ;