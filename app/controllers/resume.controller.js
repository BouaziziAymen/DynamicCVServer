const { StatusCodes } = require("http-status-codes");
const Resume = require("../models/resume.model");
// Save resume to DB
exports.postResume = async (req, res) => {
  try {
    const resume = new Resume({ userId: req.userId, ...req.body });
    const saved = await resume.save();
    res.status(StatusCodes.CREATED).json(saved);
  } catch (err) {
    console.error("Error saving resume:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to save resume" });
  }
};
