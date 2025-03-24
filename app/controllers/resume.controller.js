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

// Get all resumes for a specific user
exports.getResumesByUser = async (req, res) => {
  try {
    const userId = req.userId;
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
    res.status(StatusCodes.OK).json(resumes);
  } catch (err) {
    console.error("Error fetching resumes:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch resumes" });
  }
};
