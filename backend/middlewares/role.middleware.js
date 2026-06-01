const ApiError = require('../utils/apiError');

module.exports = (requiredRole) => (req, res, next) => {
  if (!req.user) return next(new ApiError(401, 'Not authenticated'));
  if (req.user.role !== requiredRole) return next(new ApiError(403, 'Forbidden'));
  return next();
};
