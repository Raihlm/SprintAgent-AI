const { GoogleGenAI } = require('@google/genai');

// Lazily initialise the client so missing API keys surface at request time,
// not at boot time (useful for local dev without a key yet).
let _client = null;

/**
 * Returns a singleton GoogleGenAI client.
 * Throws a descriptive error if GEMINI_API_KEY is not set.
 */
function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY is not set. Copy .env.example to .env and add your key.'
    );
  }

  if (!_client) {
    _client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  return _client;
}

/**
 * Sends a generateContent request to Gemini.
 *
 * @param {string} systemPrompt  - The system instruction for the agent.
 * @param {string} userContent   - The user-facing payload.
 * @param {object} [options]     - Optional overrides (model, temperature, maxOutputTokens).
 * @returns {Promise<string>}    - The model's text response.
 */
async function chatCompletion(systemPrompt, userContent, options = {}) {
  const client = getGeminiClient();

  const model = options.model || process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const temperature = options.temperature ?? 0.3;
  const maxOutputTokens = options.max_tokens || 4096;

  const response = await client.models.generateContent({
    model,
    config: {
      systemInstruction: systemPrompt,
      temperature,
      maxOutputTokens,
    },
    contents: userContent,
  });

  const message = response.text;
  if (!message) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }

  return message.trim();
}

module.exports = { chatCompletion };
