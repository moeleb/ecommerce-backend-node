const mongoose = require("mongoose");

const validateMongoDbID = (id=>{
    const isValid = mongoose.Types.ObjectId.isValid(id)
    if(!isValid){
        throw new Error('this ID is not valid');
    }
});

module.exports = validateMongoDbID ;