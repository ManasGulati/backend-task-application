const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');
const env = require('../config/env');
const apiRes = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const authService = require('../services/auth.service');
const tokenService = require('../services/token.service');
const { validateRegister, validateLogin, validateRefreshOrLogout } = require('../validators/auth.validator');

exports.register = asyncHandler(async (req, res) => {
  validateRegister(req.body);
  const user = await authService.register({
    name: req.body.name.trim(),
    email: req.body.email.toLowerCase().trim(),
    password: req.body.password
  });
  return apiRes.success(res, { user }, 'Registered', 201);
});

exports.login = asyncHandler(async (req, res) => {
  validateLogin(req.body);
  const result = await authService.login(req.body.email.toLowerCase().trim(), req.body.password);
  if (!result) throw new ApiError(401, 'Invalid credentials');
  return apiRes.success(res, { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken }, 'Logged in');
});

exports.refreshToken = asyncHandler(async (req, res) => {
  validateRefreshOrLogout(req.body);
  const { refreshToken } = req.body;
  const stored = await tokenService.findByToken(refreshToken);
  if (!stored) throw new ApiError(401, 'Invalid refresh token');
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(401, 'Invalid refresh token');
  }
  const access = generateAccessToken({ id: payload.id || payload._id || payload.id, role: payload.role });
  return apiRes.success(res, { accessToken: access }, 'Access token refreshed');
});

exports.logout = asyncHandler(async (req, res) => {
  validateRefreshOrLogout(req.body);
  const { refreshToken } = req.body;
  await tokenService.deleteToken(refreshToken);
  return apiRes.success(res, {}, 'Logged out');
});

exports.me = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) throw new ApiError(401, 'Not authenticated');
  const user = await require('../services/user.service').getByIdSafe(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');
  return apiRes.success(res, { user }, 'Current user');
});
