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
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        const colors = randomColor({
            count: userSymbols.length,
            luminosity: 'bright'
        });

        const promises = userSymbols.map((userSymbol) => SymbolValue.findOne({ symbol: userSymbol.symbol }).sort({ createdAt: -1 }).limit(1));
        const timePromises = userSymbols.map((userSymbol) => SymbolValue.find({ symbol: userSymbol.symbol, createdAt: { $gte: lastMonth, $lte: today } }).sort({ createdAt: -1 }).limit(500));
        const symbolValues = await Promise.all(promises);
        const timeValues = await Promise.all(timePromises);
        // const timeSymbolValues = new Map(
        //     timeValues.map((timeValue, index) => {
        //         return [timeValue[0].symbol, ({
        //             label: timeValue[0].symbol,
        //             data: timeValue.map(t => t.value).reverse(),
        //             borderColor: colors[index],
        //             fill: false
        //         })];
        //     }),
        // );

        const timeSymbolValues = //timeValues;
            timeValues.map((timeValue, index) => ({
                    label: timeValue[0].symbol,
                    data: timeValue.map(t => t.value).reverse(),
                    borderColor: colors[index],
                    fill: false
                })
        );

//         .map((timeValue, index) => ({
//             label: timeValue[0].symbol,
//             data: timeValue.map(t => t.value).reverse(),
//             borderColor: colors[index],
//             fill: false
//         })
// );

        console.log(timeSymbolValues)


        res.render('user/dashboard', {
            userSymbols,
            symbolValues,
            timeSymbolValues,
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