const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');

router.post('/auth/register', controller.register);
router.post('/auth/login', controller.login);
router.post('/auth/refresh-token', controller.refreshToken);
router.post('/auth/logout', controller.logout);
router.get('/auth/me', controller.me);

module.exports = router;
