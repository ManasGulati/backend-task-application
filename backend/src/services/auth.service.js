const bcrypt = require('bcrypt');
const userService = require('./user.service');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');
const tokenService = require('./token.service');
const env = require('../config/env');
const ApiError = require('../utils/apiError');

exports.register = async ({ name, email, password }) => {
  const existing = await userService.findByEmail(email);
  if (existing) throw new ApiError(409, 'User already exists with this email');
  const salt = await bcrypt.genSalt(Number(env.BCRYPT_SALT_ROUNDS || 10));
  const hashed = await bcrypt.hash(password, salt);
  const user = await userService.createUser({ name, email, password: hashed });
  return user;
};

exports.login = async (email, password) => {
  const user = await userService.findByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role };
  const access = generateAccessToken({ id: user._id, role: user.role });
  const refresh = generateRefreshToken({ id: user._id });
  await tokenService.saveRefreshToken(user._id, refresh);
  return { user: safeUser, accessToken: access, refreshToken: refresh };
};
