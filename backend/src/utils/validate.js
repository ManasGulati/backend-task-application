const ApiError = require('./apiError');

exports.isEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

exports.requireFields = (obj, fields = []) => {
  const missing = fields.filter((f) => !(obj && obj[f] !== undefined && obj[f] !== null && String(obj[f]).trim() !== ''));
  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);
  }
};

exports.checkPasswordStrength = (password) => {
  const p = String(password || '');
  if (p.length < 8) throw new ApiError(400, 'Password must be at least 8 characters');
  if (!/[A-Z]/.test(p) || !/[a-z]/.test(p) || !/[0-9]/.test(p) || !/[^A-Za-z0-9]/.test(p)) {
    throw new ApiError(400, 'Password must include upper, lower, number and special char');
  }
};

exports.isInEnum = (value, enumObj) => Object.values(enumObj).includes(value);

module.exports = exports;
