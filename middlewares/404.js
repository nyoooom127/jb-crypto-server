const notFound = (req, res, next) => {
    res.status(404).send('Page not found');
};

module.exports = notFound;