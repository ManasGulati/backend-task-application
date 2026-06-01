const RefreshToken = require('../models/refreshToken.model');
const { addDays } = require('../utils/date');
const env = require('../config/env');

exports.saveRefreshToken = async (userId, token) => {
  const expiresAt = addDays(new Date(), 7);
  return RefreshToken.create({ user: userId, token, expires_at: expiresAt });
};

exports.findByToken = async (token) => RefreshToken.findOne({ token }).exec();

exports.deleteToken = async (token) => RefreshToken.deleteOne({ token }).exec();

exports.deleteByUser = async (userId) => RefreshToken.deleteMany({ user: userId }).exec();
