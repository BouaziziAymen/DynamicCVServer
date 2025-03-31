const axios = require("axios");
// Save resume to DB
exports.parseSkills = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    // Send POST request to the SkillNER API
    const response = await axios.post("http://localhost:5001/extract", {
      text: text,
    });

    // Return the response from SkillNER
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error communicating with SkillNER:", error.message);
    res.status(500).json({ error: "Failed to extract skills from SkillNER" });
  }
};

exports.getSkillSuggestions = async (req, res) => {
  const query = req.query.q || "";
  const limit = req.query.limit || 10;

  if (!query) {
    return res.json([]);
  }

  try {
    const response = await axios.get("http://localhost:5001/autocomplete", {
      params: { q: query, limit: limit },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'appel à l'API d'autocomplétion:",
      error.message
    );
    res.status(500).json({
      error: "Échec de la récupération des suggestions de compétences",
    });
  }
};
