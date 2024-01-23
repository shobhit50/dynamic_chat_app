const express = require("express");
const router = express.Router();
const path = require("path");






router.get('/', (req, res) => {
    let user
    res.render('index', { user });
});
router.get('/community', (req, res) => {
    const user = 'Community'
    res.render('index', { user });
});
router.get('/new-chat', (req, res) => {
    const user = 'user'
    res.render('index', { user });
});
router.get('/userRegister', (req, res) => {
    res.render('user/userRegister');
});
router.get('/userLogin', (req, res) => {
    res.render('user/userLogin');
});


module.exports = router;