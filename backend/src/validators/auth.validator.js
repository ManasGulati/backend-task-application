const { requireFields, checkPasswordStrength, isEmail } = require('../utils/validate');
const ApiError = require('../utils/apiError');
const sanitize = require('../utils/sanitize');

exports.validateRegister = (body) => {
  sanitize.rejectUnsafe(body);
  requireFields(body, ['name', 'email', 'password']);
  if (!isEmail(body.email)) throw new ApiError(400, 'Invalid email');
  checkPasswordStrength(body.password);
};

exports.validateLogin = (body) => {
  sanitize.rejectUnsafe(body);
  requireFields(body, ['email', 'password']);
  if (!isEmail(body.email)) throw new ApiError(400, 'Invalid email');
};

exports.validateRefreshOrLogout = (body) => {
  sanitize.rejectUnsafe(body);
  requireFields(body, ['refreshToken']);
  if (typeof body.refreshToken !== 'string') throw new ApiError(400, 'refreshToken must be a string');
};
