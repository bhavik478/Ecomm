const mongoose = require("mongoose");

// Atlas string : 'mongodb+srv://anishrtridhyatech:Stq4VL66AxaQ1kUg@cluster0.f0wdpkw.mongodb.net/ff'

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://bhavikdpanchal7090:bhavikdpanchal7090@cluster0.puctaib.mongodb.net/test"
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connectDB;
