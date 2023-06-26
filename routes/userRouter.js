const express = require('express');
const router = express.Router();

const dashboard = (req, res, next) => {
    res.send('dashboard');
};

const logout = (req, res, next) => {
    res.send('logout');
};

const symbol = (req, res, next) => {
    res.send('symbol');
};

router.get('/dashboard', dashboard);
router.get('/logout', logout);
router.post('/symbol', symbol);

module.exports = router;