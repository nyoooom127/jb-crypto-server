const express = require('express');
const validate = require('../middlewares/validate');
const symbolValidator = require('../validators/symbol');
const { middleware: sql } = require('../middlewares/mysql');
const { addSymbol, dashboard } = require('../controllers/user');
const enforceAuth = require('../middlewares/enforce-auth');
const router = express.Router();

// const dashboard = (req, res, next) => {
//     res.send('dashboard');
// };

const logout = (req, res, next) => {
    res.send('logout');
};

// router.use(enforceAuth);

router.use(sql);
router.get('/dashboard', enforceAuth, dashboard);
router.get('/logout', enforceAuth, logout);
router.post('/symbol', 
// enforceAuth,
 validate(symbolValidator), addSymbol);

module.exports = router;