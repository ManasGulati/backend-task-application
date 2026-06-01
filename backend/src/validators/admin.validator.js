const ApiError = require('../utils/apiError');
const sanitize = require('../utils/sanitize');
const objectId = require('../utils/objectId');

exports.validateAdminCreateTask = (body) => {
  sanitize.rejectUnsafe(body);
  if (!body.user) throw new ApiError(400, 'user is required');
  objectId.ensureValid(body.user, 'user');
  if (!body.title || String(body.title).trim() === '') throw new ApiError(400, 'Title is required');
};

exports.validateAdminUpdateTask = (body) => {
  sanitize.rejectUnsafe(body);
  if (body.user) throw new ApiError(400, 'Cannot change task ownership');
  const allowed = ['title', 'description', 'status', 'priority', 'due_date'];
  const keys = Object.keys(body || {}).filter((k) => allowed.includes(k));
  if (!keys.length) throw new ApiError(400, 'No valid fields to update');
};
