/**
 * Global error handler middleware.
 *
 * Catches errors thrown by route handlers and formats a consistent JSON error
 * response. In production, internal error details are hidden from the client.
 */
function errorHandler(err, req, res, _next) {
  console.error(`[SprintAgent Error] ${err.message}`, err.stack);

  const isDev = process.env.NODE_ENV !== 'production';

  // OpenAI API errors expose a `status` field.
  const statusCode = err.status || err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    error: statusCode === 500 && !isDev
      ? 'An internal server error occurred. Please try again later.'
      : err.message,
  });
}

module.exports = { errorHandler };
