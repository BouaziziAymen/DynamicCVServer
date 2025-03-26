const { StatusCodes } = require("http-status-codes");
const Resume = require("../models/resume.model");
const { ObjectId } = require("mongodb");
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

// ✅ PUT /resumes/:id (for full resume update)
exports.updateResume = async (req, res) => {
  try {
    const resumeId = req.body._id;

    if (!ObjectId.isValid(resumeId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid resume ID" });
    }

    const updated = await Resume.findOneAndReplace(
      { _id: resumeId, userId: req.userId }, // Ensure only the user's resume is updated
      { ...req.body, userId: req.userId }, // Replace content, preserve userId
      { new: true, upsert: false } // Do not create if missing
    );

    if (!updated) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Resume not found" });
    }

    res.status(StatusCodes.OK).json(updated);
  } catch (err) {
    console.error("Error updating resume:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to update resume" });
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
