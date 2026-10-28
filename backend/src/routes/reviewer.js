const { Router } = require('express');
const { body, validationResult } = require('express-validator');
const { chatCompletion } = require('../utils/openaiClient');
const { REVIEWER_SYSTEM_PROMPT, buildReviewerUserPrompt } = require('../agents/reviewerAgent');

const router = Router();

// ─── Validation Rules ──────────────────────────────────────────────────────────
const validateReviewerRequest = [
  body('jiraTicket')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('jiraTicket is required and must be a non-empty string.')
    .isLength({ max: 8000 })
    .withMessage('jiraTicket must not exceed 8000 characters.'),

  body('submittedCode')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('submittedCode is required and must be a non-empty string.')
    .isLength({ max: 40000 })
    .withMessage('submittedCode must not exceed 40000 characters.'),
];

// ─── POST /api/reviewer/review ────────────────────────────────────────────────
/**
 * Accepts a Jira ticket + submitted code, forwards them to the Reviewer Agent,
 * and returns the structured APPROVED / NEEDS REVISION report.
 */
router.post('/review', validateReviewerRequest, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { jiraTicket, submittedCode } = req.body;

  try {
    const userPrompt = buildReviewerUserPrompt(jiraTicket, submittedCode);

    const result = await chatCompletion(REVIEWER_SYSTEM_PROMPT, userPrompt, {
      max_tokens: 2048,
      temperature: 0.1, // Near-zero for consistent, objective auditing output.
    });

    // Extract verdict from the response for quick client-side access.
    const isApproved = /overall status.*approved/i.test(result);
    const verdict = isApproved ? 'APPROVED' : 'NEEDS REVISION';

    return res.json({ success: true, verdict, result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
