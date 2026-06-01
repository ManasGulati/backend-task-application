const ApiError = require('../utils/apiError');

module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode || 500).json({ success: false, message: err.message, details: err.details || null });
  }
  console.error(err);
  return res.status(500).json({ success: false, message: 'Internal Server Error' });
};
