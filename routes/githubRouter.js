const express = require('express');
const router = express.Router()

const auth = require('../middlewares/auth');

router.get('/', auth.authenticate('github', { scope: [ 'user:email' ] })); 
router.get('/callback', auth.authenticate('github', { failureRedirect: '/welcome', successRedirect: '/dashboard' }))

module.exports = router;


// const express = require('express');
// const router = express.Router();

// const authenticate = (req, res, next) => {
//     res.send('authenticate');
// };

// const callback = (req, res, next) => {
//     res.send('callback');
// };

// router.get('/authenticate', authenticate);
// router.get('/callback', callback);

// module.exports = router;