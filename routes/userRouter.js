const express = require('express');
const validate = require('../middlewares/validate');
const symbolValidator = require('../validators/symbol');
const { middleware: sql } = require('../middlewares/mysql');
const { addSymbol, dashboard, logout } = require('../controllers/user');
const enforceAuth = require('../middlewares/enforce-auth');
const router = express.Router();

router.use(sql);
router.get('/dashboard', enforceAuth, dashboard);
router.get('/logout', enforceAuth, logout);
router.post('/symbol', enforceAuth, validate(symbolValidator), addSymbol);

module.exports = router;