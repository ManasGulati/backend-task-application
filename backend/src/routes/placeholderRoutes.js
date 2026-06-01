const express = require('express');
const router = express.Router();
const { notImplemented } = require('../controllers/placeholderController');

router.get('/placeholder', notImplemented);

module.exports = router;
