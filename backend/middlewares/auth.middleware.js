const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const env = require('../config/env');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return next(new ApiError(401, 'Authorization header missing'));
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.user = { id: payload.id || payload._id || payload.id, role: payload.role };
    return next();
  } catch (err) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};
