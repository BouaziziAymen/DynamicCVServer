/**
 * @fileoverview Contrôleur EMSI pour appels authentifiés vers l’API Lightcast.
 * Gère le token OAuth, la recherche et l’extraction de compétences.
 */

const axios = require("axios");

// 🛠️ Paramètres d’authentification (mettre ces valeurs dans un fichier .env)
const EMSI_AUTH_URL = "https://auth.emsicloud.com/connect/token";
const EMSI_API_BASE_URL = "https://emsiservices.com";
const CLIENT_ID = process.env.EMSI_CLIENT_ID;
const CLIENT_SECRET = process.env.EMSI_CLIENT_SECRET;
const SCOPE = "emsi_open";

// 🔐 Variables globales pour stocker le token temporairement
let accessToken = null;
let tokenExpiry = null;

/**
 * @function getAccessToken
 * @description Récupère ou renouvelle un token OAuth2 EMSI
 * @returns {Promise<string>} Le token valide
 */
async function getAccessToken() {
  const now = Date.now();

  if (accessToken && tokenExpiry && now < tokenExpiry - 60000) {
    return accessToken;
  }

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("grant_type", "client_credentials");
  params.append("scope", SCOPE);

  try {
    const response = await axios.post(EMSI_AUTH_URL, params);
    accessToken = response.data.access_token;
    tokenExpiry = now + response.data.expires_in * 1000;
    return accessToken;
  } catch (error) {
    console.error(
      "❌ Échec authentification EMSI:",
      error.response?.data || error.message
    );
    throw new Error("Impossible de récupérer le token EMSI");
  }
}

/**
 * @function searchSkillsFromQuery
 * @description Recherche des compétences via EMSI (GET)
 * @route GET /api/emsi/skills/search?q=aws...
 */
exports.searchSkillsFromQuery = async (req, res) => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(
      `${EMSI_API_BASE_URL}/skills/versions/latest/skills`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: req.query,
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "❌ Erreur recherche EMSI:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la recherche de compétences" });
  }
};

/**
 * @function extractSkillsFromText
 * @description Extrait les compétences d’un texte via EMSI (POST)
 * @route POST /api/emsi/skills/extract
 */
exports.extractSkillsFromText = async (req, res) => {
  try {
    const { text, language = "fr", confidenceThreshold = 0 } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Le champ "text" est requis.' });
    }

    const token = await getAccessToken();

    const response = await axios.post(
      `${EMSI_API_BASE_URL}/skills/versions/latest/extract`,
      { text, confidenceThreshold },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: { language },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "❌ Erreur extraction EMSI:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ error: "Erreur lors de l’extraction de compétences" });
  }
};
