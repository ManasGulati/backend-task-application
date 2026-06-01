const ApiError = require('../utils/apiError');
const sanitize = require('../utils/sanitize');
const { isInEnum } = require('../utils/validate');
const statuses = require('../constants/taskStatus');
const priorities = require('../constants/taskPriority');

exports.validateCreate = (body) => {
  sanitize.rejectUnsafe(body);
  if (!body.title || String(body.title).trim() === '') throw new ApiError(400, 'Title is required');
  if (body.status && !isInEnum(body.status, statuses)) throw new ApiError(400, 'Invalid status');
  if (body.priority && !isInEnum(body.priority, priorities)) throw new ApiError(400, 'Invalid priority');
  if (body.user) throw new ApiError(400, 'Cannot set user on this route');
};

exports.validateUpdate = (body) => {
  sanitize.rejectUnsafe(body);
  const allowed = ['title', 'description', 'status', 'priority', 'due_date'];
  const keys = Object.keys(body || {}).filter((k) => allowed.includes(k));
  if (!keys.length) throw new ApiError(400, 'No valid fields to update');
  if (body.user) throw new ApiError(400, 'Cannot set user on this route');
};
