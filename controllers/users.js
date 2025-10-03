const User = require('../model/user.js');

module.exports.rendersignup=(req, res) => {
    res.render("users/signup.ejs");
}


module.exports.signup=async(req, res) => {
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
}

module.exports.renderlogin=(req, res) => {
  res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
  // console.log(req.user);
  req.flash('success', 'You are logged in!');
  res.redirect(res.locals.redirectUrl || '/listings');
}

module.exports.logout=(req, res,next) => {
  req.logout((err)=>{
    if(err) 
      {
        return next(err);
      }
  req.flash('success', 'You are logged out!');
  res.redirect('/listings');
  })
}