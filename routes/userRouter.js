const express = require('express');
const validate = require('../middlewares/validate');
const symbolValidator = require('../validators/symbol');
const { symbolController } = require('../controllers/user');
const router = express.Router();

const dashboard = (req, res, next) => {
    res.send('dashboard');
};

const logout = (req, res, next) => {
    res.send('logout');
};

router.get('/dashboard', dashboard);
router.get('/logout', logout);
router.post('/symbol', validate(symbolValidator), symbolController);

module.exports = router;