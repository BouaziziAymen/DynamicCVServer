const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name: String,
  categoryName: String,
});

const WorkExperienceSchema = new mongoose.Schema({
  isCurrent: Boolean,
  jobTitle: String,
  company: String,
  location: String,
  startDate: Date,
  endDate: Date,
  actions: [String],
  skills: [SkillSchema],
  locationType: {
    type: String,
    enum: ["on_site", "remote", "hybrid"],
    required: true,
  },
  contractType: {
    type: String,
    enum: ["full_time", "part_time", "freelance", "internship"],
    required: true,
  },
});

const SkillCategorySchema = new mongoose.Schema({
  name: String,
  skills: [SkillSchema],
});

const ResumeSchema = new mongoose.Schema(
  {
    userId: String,
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      dateOfBirth: Date,
      address: String,
      linkedIn: String,
      github: String,
      portfolio: String,
      blog: String,
      showLinkedIn: Boolean,
      showGithub: Boolean,
      showPortfolio: Boolean,
      showBlog: Boolean,
      showDateOfBirth: Boolean,
      showAddress: Boolean,
    },
    introduction: mongoose.Schema.Types.Mixed,
    personalSummary: String,
    workExperiences: [WorkExperienceSchema],
    skillsCategories: [SkillCategorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", ResumeSchema);
