const connectDB = require("../config/db.config.js"); // Import MongoDB connection
const User = require("../models/user.model");
const Role = require("../models/role.model");
const Resume = require("../models/resume.model");
const RefreshToken = require("../models/refreshToken.model");

const db = {};

db.connectDB = connectDB;
db.user = User;
db.role = Role;
db.resume = Resume;
db.refreshToken = RefreshToken;

// Define available roles
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
