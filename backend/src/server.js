const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const seedAdmin = require('./config/seedAdmin');

const start = async () => {
  try {
    await connectDB();
    await seedAdmin();

    const port = env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running in ${env.NODE_ENV} on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
