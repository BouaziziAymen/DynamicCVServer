const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./app/config/db.config.js"); // Import MongoDB connection
const Role = require("./app/models/role.model"); // Import Role model

const app = express();

// CORS options
const corsOptions = {
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Enable CORS with options
app.use(cors(corsOptions));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB().then(() => initial()); // Connect & Initialize roles

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Aymen's application." });
});

// Setting routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/resume.routes")(app);

// Set port and start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}.`);
});

// Initialize roles collection in MongoDB
async function initial() {
  try {
    const count = await Role.countDocuments();
    if (count === 0) {
      await Role.create({ name: "user" });
      await Role.create({ name: "moderator" });
      await Role.create({ name: "admin" });
      console.log("✅ Roles initialized.");
    } else {
      console.log("✅ Roles already exist.");
    }
  } catch (err) {
    console.error("❌ Error initializing roles:", err);
  }
}
