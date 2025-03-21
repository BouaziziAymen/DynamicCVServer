const User = require("../models/user.model");
const ROLES = ["user", "admin", "moderator"];

/**
 * Middleware to check for duplicate username or email
 */
const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username: req.body.email }),
      User.findOne({ email: req.body.email }),
    ]);

    if (existingUsername) {
      return res
        .status(400)
        .send({ message: "Failed! Username is already in use!" });
    }

    if (existingEmail) {
      return res
        .status(400)
        .send({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/**
 * Middleware to check if roles exist in the system
 */
const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).send({
          message: `Failed! Role does not exist: ${req.body.roles[i]}`,
        });
      }
    }
  }
  next();
};

// Export middleware functions
module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
};
