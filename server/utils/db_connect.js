const mongoose = require("mongoose");
const MongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MongoURI);
    console.log("Connection successfull to database");
  } catch (error) {
    console.error("Database connection unsuccessfull", error);
  }
};

module.exports = connectDB;
