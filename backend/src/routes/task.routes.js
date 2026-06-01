const express = require('express');
const router = express.Router();
const controller = require('../controllers/task.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth, controller.create);
router.get('/', auth, controller.list);
router.get('/:id', auth, controller.get);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
