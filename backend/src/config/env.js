const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const required = [
  'NODE_ENV',
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
  'BCRYPT_SALT_ROUNDS',
  'CLIENT_URL'
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.warn('Warning: missing env vars:', missing.join(', '));
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  ADMIN_NAME: process.env.ADMIN_NAME || 'Student Admin',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@student.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@12345',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000'
};

module.exports = env;
