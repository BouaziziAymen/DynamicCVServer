const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
