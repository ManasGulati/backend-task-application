const express = require('express');
const router = express.Router();
const controller = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/users', auth, role('admin'), controller.listUsers);
router.get('/tasks', auth, role('admin'), controller.listTasks);
router.post('/tasks', auth, role('admin'), controller.createTask);
router.get('/tasks/:id', auth, role('admin'), controller.getTask);
router.put('/tasks/:id', auth, role('admin'), controller.updateTask);
router.delete('/tasks/:id', auth, role('admin'), controller.deleteTask);

module.exports = router;
