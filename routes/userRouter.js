const express = require('express');
const validate = require('../middlewares/validate');
const symbolValidator = require('../validators/symbol');
const { middleware: sql } = require('../middlewares/mysql');
const { addSymbol } = require('../controllers/user');
const router = express.Router();

const dashboard = (req, res, next) => {
    res.send('dashboard');
};

const logout = (req, res, next) => {
    res.send('logout');
};

router.use(sql);
router.get('/dashboard', dashboard);
router.get('/logout', logout);
router.post('/symbol', validate(symbolValidator), addSymbol);

module.exports = router;