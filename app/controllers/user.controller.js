const User = require("../models/user.model");
const Role = require("../models/role.model");

/**
 * Public access endpoint (No authentication required)
 */
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

/**
 * User-specific content (Requires authentication)
 */
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

/**
 * Admin-only content (Requires authentication & Admin role)
 */
exports.adminBoard = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("roles");

    if (!user) {
      return res.status(404).send({ message: "User Not Found." });
    }

    // Check if user has the "admin" role
    const isAdmin = user.roles.some((role) => role.name === "admin");
    if (!isAdmin) {
      return res.status(403).send({ message: "Require Admin Role!" });
    }

    res.status(200).send("Admin Content.");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Moderator-only content (Requires authentication & Moderator role)
 */
exports.moderatorBoard = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("roles");

    if (!user) {
      return res.status(404).send({ message: "User Not Found." });
    }

    // Check if user has the "moderator" role
    const isModerator = user.roles.some((role) => role.name === "moderator");
    if (!isModerator) {
      return res.status(403).send({ message: "Require Moderator Role!" });
    }

    res.status(200).send("Moderator Content.");
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
