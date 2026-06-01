const ApiError = require('./apiError');

const unsafePatterns = [/<script\b/i, /onclick\s*=/i, /onerror\s*=/i, /<iframe\b/i];

function ensureString(v) {
  if (v == null) return '';
  return String(v).trim();
}

exports.trim = (v) => ensureString(v);

exports.normalizeEmail = (email) => ensureString(email).toLowerCase();

exports.rejectUnsafe = (obj) => {
  for (const key of Object.keys(obj || {})) {
    const val = obj[key];
    if (typeof val === 'string') {
      for (const pat of unsafePatterns) {
        if (pat.test(val)) {
          throw new ApiError(400, 'Unsafe input detected');
        }
      }
    }
  }
};
