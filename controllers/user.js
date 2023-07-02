const randomColor = require('randomcolor');
const UserSymbol = require('../models/mysql/userSymbol');
const SymbolValue = require('../models/mongo/symbolValue');

const addSymbol = async (req, res, next) => {
    try {
        const userSymbol = new UserSymbol(req.db);
        await userSymbol.add({ symbol: req.body.symbol, userId: req.user.id });

        return res.redirect('/dashboard');
    } catch (err) {
        return next(err);
    }
};

const dashboard = async (req, res, next) => {
    try {
        const userSymbol = new UserSymbol(req.db);
        const userSymbols = await userSymbol.findByUserId({
            userId: req.user.id
        });

        const promises = userSymbols.map((userSymbol) => SymbolValue.findOne({ symbol: userSymbol.symbol }).sort({ createdAt: -1 }).limit(1));
        const symbolValues = await Promise.all(promises);
        const colors = randomColor({
            count: userSymbols.length,
            luminosity: 'bright'
        });

        res.render('user/dashboard', {
            userSymbols,
            symbolValues,
            colors
        });
    } catch (err) {
        next(err);
    }
};

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/welcome');
    });

};

module.exports = {
    addSymbol,
    dashboard,
    logout
};