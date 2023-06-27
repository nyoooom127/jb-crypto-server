const welcome = (req, res, next) => {
    res.render('user/welcome');
}

module.exports = {
    welcome
};