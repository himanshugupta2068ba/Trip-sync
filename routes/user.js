const express = require('express');
const router = express.Router();
const User = require('../model/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render("users/signup.ejs");
});

router.post('/signup', wrapAsync(async(req, res) => {
    try{
  let { username, email, password } = req.body;
  const newUser=new User({ username, email });
  const registeredUser=await User.register(newUser,password);
//   console.log(registeredUser);
  req.flash('success', 'Welcome to the app! You are now logged in');
  res.redirect('/listings');
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

router.get('/login', (req, res) => {
  res.render("users/login.ejs");
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/listings',
  successFlash: true,  // success message
  failureRedirect: '/login',
  failureFlash: true,
}));
module.exports = router;