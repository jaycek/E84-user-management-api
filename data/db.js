const mongoose = require("mongoose")
require('dotenv').config()

const connectDB = async()=>{
    await mongoose.connect(process.env.MONGODB_URL)
}

connectDB()
.then(()=>console.log("DB connected.."))
.catch((err)=>console.error(err))

module.exports= connectDB