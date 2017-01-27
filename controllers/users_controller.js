const express = require("express");
const User = require("../models/user");
const passport = require('../config/ppConfig');
const router = express.Router();
const flash = require("connect-flash");
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/signup', function(req, res) {
  res.render('user/signup');
});

// router.get("/userProfile", function(req, res) {
//   User.find({}, function(err, user){
//     if (err) throw err;
//     // console.log('user ',user);
//     res.render("user/userProfile", { user : user })
//   })
// });

router.post('/signup', function(req, res) {
  User.create({
    email: req.body.email,
    password: req.body.password,
    surname: req.body.surname
  }, function(err, createdUser) {
    if(err){
      // FLASH -
      req.flash('error', 'Could not create user account');
      res.redirect('/user/signup');
    } else {
      // FLASH
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in'
      })(req, res);
    }
  });
});

router.get('/login', function(req, res) {
  res.render('user/login');
});

// FLASH
router.post('/login', passport.authenticate('local', {
  successRedirect: '/trips',
  failureRedirect: '/user/login',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You have logged in'
}));


router.get('/logout', function(req, res) {
  req.logout();
  // FLASH
  req.flash('success', 'You have logged out');
  res.redirect('/');
});

router.get('/userProfile', isLoggedIn, function(req, res) {
  res.render('user/userProfile');
});

module.exports = router;
