const Task = require('../models/task.model');
const ApiError = require('../utils/apiError');

exports.createForUser = async (userId, payload) => {
  const doc = await Task.create({ ...payload, user: userId });
  return doc;
};

exports.getByUser = async (userId) => Task.find({ user: userId }).exec();

exports.getByIdAndUser = async (id, userId) => Task.findOne({ _id: id, user: userId }).exec();

exports.updateByIdAndUser = async (id, userId, updates) => {
  const updated = await Task.findOneAndUpdate({ _id: id, user: userId }, updates, { new: true }).exec();
  if (!updated) throw new ApiError(404, 'Task not found');
  return updated;
};

exports.deleteByIdAndUser = async (id, userId) => {
  const res = await Task.deleteOne({ _id: id, user: userId }).exec();
  if (!res.deletedCount) throw new ApiError(404, 'Task not found');
};
