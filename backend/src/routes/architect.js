const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const { chatCompletion } = require('../utils/openaiClient');
const { ARCHITECT_SYSTEM_PROMPT, buildArchitectUserPrompt } = require('../agents/architectAgent');

const router = Router();

// ─── Validation Rules ──────────────────────────────────────────────────────────
const validateArchitectRequest = [
  body('jiraTicket')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('jiraTicket is required and must be a non-empty string.')
    .isLength({ max: 8000 })
    .withMessage('jiraTicket must not exceed 8000 characters.'),

  body('folderStructure')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('folderStructure is required and must be a non-empty string.')
    .isLength({ max: 4000 })
    .withMessage('folderStructure must not exceed 4000 characters.'),
];

// ─── POST /api/architect/generate ─────────────────────────────────────────────
/**
 * Accepts a Jira ticket + folder structure, forwards them to the Architect Agent,
 * and returns the full implementation plan + generated code.
 */
router.post('/generate', validateArchitectRequest, async (req, res, next) => {
  // Return validation errors as 400 before touching OpenAI.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { jiraTicket, folderStructure } = req.body;

  try {
    const userPrompt = buildArchitectUserPrompt(jiraTicket, folderStructure);

    const result = await chatCompletion(ARCHITECT_SYSTEM_PROMPT, userPrompt, {
      // Higher token limit for full code generation; stay within model max.
      max_tokens: 4096,
      temperature: 0.2, // Low temperature for deterministic, structured output.
    });

    return res.json({ success: true, result });
  } catch (err) {
    // Delegate to the global error handler.
    next(err);
  }
});

module.exports = router;
