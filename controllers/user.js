const UserSymbol = require('../models/userSymbol');

const addSymbol = async (req, res, next) => {
    try {
        const userSymbol = new UserSymbol(req.db);
        await userSymbol.add(req.body);

        return res.send(`Success adding symbol: '${req.body.symbol}'`);
    }catch(err){
        return next(err);
    }
};

module.exports = {
    addSymbol
};