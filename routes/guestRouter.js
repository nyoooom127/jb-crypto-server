const express = require('express');
const { welcome } = require('../controllers/guest');
const router = express.Router();

router.get('/welcome', welcome);

module.exports = router;