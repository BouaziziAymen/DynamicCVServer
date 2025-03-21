const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require("../models/user.model");

/**
 * Verify JWT Token
 */
const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token.slice(7, token.length), config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id; // Store user ID in request
    next();
  });
};

/**
 * Check if User has Admin Role
 */
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("roles");

    if (!user) {
      return res.status(404).send({ message: "User Not Found." });
    }

    const isAdmin = user.roles.some((role) => role.name === "admin");
    if (!isAdmin) {
      return res.status(403).send({ message: "Require Admin Role!" });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * Check if User has Moderator Role
 */
const isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("roles");

    if (!user) {
      return res.status(404).send({ message: "User Not Found." });
    }

    const isModerator = user.roles.some((role) => role.name === "moderator");
    if (!isModerator) {
      return res.status(403).send({ message: "Require Moderator Role!" });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * Check if User has Moderator or Admin Role
 */
const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("roles");

    if (!user) {
      return res.status(404).send({ message: "User Not Found." });
    }

    const hasRole = user.roles.some(
      (role) => role.name === "moderator" || role.name === "admin"
    );

    if (!hasRole) {
      return res
        .status(403)
        .send({ message: "Require Moderator or Admin Role!" });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Export Middleware Functions
module.exports = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};
