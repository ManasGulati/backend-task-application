const User = require('../models/user.model');
const Task = require('../models/task.model');
const ApiError = require('../utils/apiError');

exports.getAllUsers = async () => User.find().select('-password').exec();

exports.getAllTasks = async () => Task.find().populate('user', 'name role').exec();

exports.createTaskForUser = async (userId, payload) => {
  const exists = await User.findById(userId).exec();
  if (!exists) throw new ApiError(400, 'User not found');
  const doc = await Task.create({ ...payload, user: userId });
  return doc;
};

exports.updateTaskNoReassign = async (id, updates) => {
  if (updates.user) throw new ApiError(400, 'Cannot change task ownership');
  const updated = await Task.findByIdAndUpdate(id, updates, { new: true }).exec();
  if (!updated) throw new ApiError(404, 'Task not found');
  return updated;
};

exports.deleteTask = async (id) => {
  const res = await Task.findByIdAndDelete(id).exec();
  if (!res) throw new ApiError(404, 'Task not found');
};
