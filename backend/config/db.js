const mongoose = require("mongoose");
const connectDB =async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB Connected Succesfully");    
    }catch(err){
        console.error(err)
    }
}

module.exports = connectDB;