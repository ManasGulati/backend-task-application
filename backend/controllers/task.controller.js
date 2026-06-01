const asyncHandler = require('../utils/asyncHandler');
const apiRes = require('../utils/apiResponse');
const taskService = require('../services/task.service');
const { validateCreate, validateUpdate } = require('../validators/task.validator');

exports.create = asyncHandler(async (req, res) => {
  validateCreate(req.body);
  const doc = await taskService.createForUser(req.user.id, req.body);
  return apiRes.success(res, { task: doc }, 'Task created', 201);
});

exports.list = asyncHandler(async (req, res) => {
  const tasks = await taskService.getByUser(req.user.id);
  return apiRes.success(res, { tasks }, 'Tasks fetched');
});

exports.get = asyncHandler(async (req, res) => {
  const task = await taskService.getByIdAndUser(req.params.id, req.user.id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  return apiRes.success(res, { task }, 'Task fetched');
});

exports.update = asyncHandler(async (req, res) => {
  validateUpdate(req.body);
  const updated = await taskService.updateByIdAndUser(req.params.id, req.user.id, req.body);
  return apiRes.success(res, { task: updated }, 'Task updated');
});

exports.remove = asyncHandler(async (req, res) => {
  await taskService.deleteByIdAndUser(req.params.id, req.user.id);
  return apiRes.success(res, {}, 'Task deleted');
});
