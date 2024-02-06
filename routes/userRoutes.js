const express = require("express");
const router = express.Router();
const path = require("path");
const usermodel = require("../models/user");
// const bcrypt = require('bcrypt');
const { userRegisterLoad, userRegister, userLoginLoad, userLogin, logout } = require("../controller/login_logout");
const { checkAuth } = require("../middleware/authentication");
const message = require("../models/chat");




router.get('/', (req, res) => { res.redirect('/community'); }); // root route    

// login and User register routes
router.get('/userRegister', userRegisterLoad);      // render ragister form
router.post('/userRegister', userRegister);        // register user in database
router.get('/userLogin', userLoginLoad);          // render login form to user 
router.post('/userLogin', userLogin);            // login user and create jwt token
router.get('/Logout', checkAuth, logout);                  // logout user and clear cookie



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
    try {
        const user = 'Community';
        res.render('index', { user });
    } catch (err) {
        console.log(err);
    }
});

router.get('/new-chat', checkAuth, async (req, res) => {
    try {
        const user = req.user.username;
        const chat = await usermodel.find({ _id: { $ne: req.user.id } });
        res.render('userList', { user, chat });
    } catch (err) {
        console.log(err);
    }
});

router.get('/Chat/:id', checkAuth, async (req, res) => {
    try {
        const user = await usermodel.findOne({ _id: req.params.id });
        const chats = await message.find({ $or: [{ sender: req.user.id, receiver: req.params.id }, { sender: req.params.id, receiver: req.user.id }] }).sort({ createdAt: 1 }).populate('sender receiver');
        const current = req.user;
        res.render('OneToOne.ejs', { user, chats, current });
    } catch (err) {
        console.log(err);
    }
});

// 404 page not found
router.get('*', (req, res) => {
    res.json({ message: '404 Page Not Found' });
});




module.exports = router;