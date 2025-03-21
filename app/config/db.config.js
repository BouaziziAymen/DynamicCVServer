const mongoose = require("mongoose");

// MongoDB connection string (change `<your_database_name>` to your DB name)
const MONGO_URI =
  process.env.MONGO_URI;

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected...");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;
