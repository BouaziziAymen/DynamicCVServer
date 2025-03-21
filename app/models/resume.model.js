const mongoose = require("mongoose");
const { user } = require(".");

const SkillSchema = new mongoose.Schema({
  name: String,
  categoryName: String,
});

const WorkExperienceSchema = new mongoose.Schema({
  jobTitle: String,
  company: String,
  location: String,
  startDate: Date,
  endDate: Date,
  actions: [String],
  skills: [SkillSchema],
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
    },
    introduction: mongoose.Schema.Types.Mixed,
    personalSummary: String,
    workExperiences: [WorkExperienceSchema],
    skillsCategories: [SkillCategorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", ResumeSchema);
