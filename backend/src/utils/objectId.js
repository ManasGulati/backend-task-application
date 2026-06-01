const mongoose = require('mongoose');
const ApiError = require('./apiError');

exports.isValid = (id) => mongoose.Types.ObjectId.isValid(String(id));

exports.ensureValid = (id, name = 'id') => {
  if (!exports.isValid(id)) throw new ApiError(400, `Invalid ObjectId for ${name}`);
};
