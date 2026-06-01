const asyncHandler = require('../utils/asyncHandler');
const apiRes = require('../utils/apiResponse');
const adminService = require('../services/admin.service');
const { validateAdminCreateTask, validateAdminUpdateTask } = require('../validators/admin.validator');

exports.listUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getAllUsers();
  return apiRes.success(res, { users }, 'Users fetched');
});

exports.listTasks = asyncHandler(async (req, res) => {
  const tasks = await adminService.getAllTasks();
  return apiRes.success(res, { tasks }, 'Tasks fetched');
});

exports.createTask = asyncHandler(async (req, res) => {
  validateAdminCreateTask(req.body);
  const task = await adminService.createTaskForUser(req.body.user, req.body);
  return apiRes.success(res, { task }, 'Task created', 201);
});

exports.getTask = asyncHandler(async (req, res) => {
  const task = await require('../models/task.model').findById(req.params.id).populate('user', 'name role').exec();
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  return apiRes.success(res, { task }, 'Task fetched');
});

exports.updateTask = asyncHandler(async (req, res) => {
  validateAdminUpdateTask(req.body);
  const updated = await adminService.updateTaskNoReassign(req.params.id, req.body);
  return apiRes.success(res, { task: updated }, 'Task updated');
});

exports.deleteTask = asyncHandler(async (req, res) => {
  await adminService.deleteTask(req.params.id);
  return apiRes.success(res, {}, 'Task deleted');
});
