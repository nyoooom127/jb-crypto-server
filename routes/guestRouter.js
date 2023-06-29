const express = require('express');
const { welcome } = require('../controllers/guest');
const router = express.Router();
const enforceGuest = require('../middlewares/enforce-guest');

router.get('/welcome', enforceGuest, welcome);

module.exports = router;