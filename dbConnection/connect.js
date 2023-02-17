const mongoose = require('mongoose');

const connectDb = async() => {
  console.log("mongoose connection")
  return await mongoose.connect(process.env.MONGODB_URI , {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

module.exports = { 
  connectDb
}