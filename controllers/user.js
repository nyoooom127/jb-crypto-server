const UserSymbol = require('../models/mysql/userSymbol');
const SymbolValue = require('../models/mongo/symbolValue');

const addSymbol = async (req, res, next) => {
    try {
        const userSymbol = new UserSymbol(req.db);
        await userSymbol.add(req.body);

        return res.send(`Success adding symbol: '${req.body.symbol}'`);
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
        // const symbolValues = await Promise.all(promises);
        const symbolValues = userSymbols.map((userSymbol) => ({symbol: userSymbol.symbol, value: Math.random() * 1000}));

        res.render('user/dashboard', {
            userSymbols,
            symbolValues,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    addSymbol,
    dashboard
};