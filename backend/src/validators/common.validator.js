const ApiError = require('../utils/apiError');
const objectId = require('../utils/objectId');

exports.validateObjectId = (id, name = 'id') => {
  try {
    objectId.ensureValid(id, name);
  } catch (err) {
    throw new ApiError(400, err.message);
  }
};

exports.rejectDisallowedFields = (obj, disallowed = []) => {
  for (const f of disallowed) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, f)) {
      throw new ApiError(400, `Field not allowed: ${f}`);
    }
  }
};

exports.requireFields = (obj, fields = []) => {
  const missing = fields.filter((f) => !(obj && obj[f] !== undefined && obj[f] !== null && String(obj[f]).trim() !== ''));
  if (missing.length) throw new ApiError(400, `Missing fields: ${missing.join(', ')}`);
};
