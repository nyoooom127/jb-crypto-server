const symbolController = (req, res, next) => {
    res.send(`symbol is: ${req.body.symbol}`);
};

module.exports = {
    symbolController
};