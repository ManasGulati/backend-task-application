const bcrypt = require('bcrypt');
const env = require('./env');
const User = require('../models/user.model');

const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ email: env.ADMIN_EMAIL });
    if (existing) return;

    const salt = await bcrypt.genSalt(Number(env.BCRYPT_SALT_ROUNDS || 10));
    const hashed = await bcrypt.hash(env.ADMIN_PASSWORD, salt);

    await User.create({
      name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL,
      password: hashed,
      role: 'admin'
    });
    if (env.NODE_ENV === 'development') {
      console.log('Seeded admin user:', env.ADMIN_EMAIL);
    }
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
  }
};

module.exports = seedAdmin;
