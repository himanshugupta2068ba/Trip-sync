const express = require('express');
const router = express.Router();
const User = require('../model/user.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

router.get('/signup', (req, res) => {
    res.render("users/signup.ejs");
});

router.post('/signup', wrapAsync(async(req, res) => {
    try{
  let { username, email, password } = req.body;
  const newUser=new User({ username, email });
  const registeredUser=await User.register(newUser,password);
  req.login(registeredUser,(err)=>{
    if(err) throw err;
    req.flash('success', 'Welcome to the app! You are now logged in');
    res.redirect('/listings');
  });
//   console.log(registeredUser);
  // req.flash('success', 'Welcome to the app! You are now logged in');
  // res.redirect('/listings');
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

router.get('/login', (req, res) => {
  res.render("users/login.ejs");
});

router.post('/login',saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: '/login',
  failureFlash: true,
}),
async(req,res)=>{
  // console.log(req.user);
  req.flash('success', 'You are logged in!');
  res.redirect(res.locals.redirectUrl || '/listings');
}

);
router.get('/logout', (req, res,next) => {
  req.logout((err)=>{
    if(err) 
      {
        return next(err);
      }
  req.flash('success', 'You are logged out!');
  res.redirect('/listings');
  })
});
module.exports = router;