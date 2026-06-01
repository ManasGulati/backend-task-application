const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors');
const requestSanitizer = require('./middlewares/requestSanitizer.middleware');
const notFound = require('./middlewares/notFound.middleware');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestSanitizer);



const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api/v1', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
