const express = require("express");
const router = express.Router();
const path = require("path");
const usermodel = require("../models/user");
const bcrypt = require('bcrypt');
const { userRegisterLoad, userRegister, userLoginLoad, userLogin, logout } = require("../controller/login_logout");
const checkAuth = require("../middleware/authentication");



router.get('/', (req, res) => { res.redirect('/community'); }); // root route    

// login and User register routes
router.get('/userRegister', userRegisterLoad);
router.post('/userRegister', userRegister);
router.get('/userLogin', userLoginLoad);
router.post('/userLogin', userLogin);
router.get('/Logout', logout);

// ---------------------------------------------------------------------
// const checkAuth = (req, res, next) => {
//     passport.authenticate('jwt', { session: false }, (err, user, info) => {
//         if (err || !user) {
//             console.log('Error during authentication:', info.message);
//             return res.redirect('/userLogin');
//         }
//         req.user = user;
//         next();
//     })(req, res, next);
// };


// navigation api routes
router.get('/community', checkAuth, (req, res) => {
    const user = 'Community';
    res.render('index', { user });
});

router.get('/new-chat', checkAuth, (req, res) => {
    const user = req.user.username;
    res.render('index', { user });
});



module.exports = router;