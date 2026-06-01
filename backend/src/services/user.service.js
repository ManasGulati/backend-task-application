const User = require('../models/user.model');

exports.createUser = async (data) => {
  const user = await User.create(data);
  return user.toSafeObject ? user.toSafeObject() : user;
};

exports.findByEmail = async (email) => {
  return User.findOne({ email }).exec();
};

exports.getByIdSafe = async (id) => {
  const u = await User.findById(id).select('-password').exec();
  return u;
};

exports.getAllUsers = async () => User.find().select('-password').exec();
