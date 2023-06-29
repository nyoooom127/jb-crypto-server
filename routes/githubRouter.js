const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');

router.get('/', auth.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/callback', auth.authenticate('github', { failureRedirect: '/welcome', successRedirect: '/dashboard', session: false }));

module.exports = router;