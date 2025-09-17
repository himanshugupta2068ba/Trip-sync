const express=require("express");
const app=express();
const posts=require("./routes/post.js");
const user=require("./routes/user.js")
const session=require("express-session");
const flash=require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


const sessionoption={
    secret:"secretcode",
    resave:false,
    saveUninitialized:false
}
app.use(session(sessionoption));
app.use(flash());

app.use("/hello",(req,res,next)=>{
      res.locals.message=req.flash("success");
        res.locals.message=req.flash("error");
        next();``
})
app.get("/register",(req,res)=>{
 let {name="annonymous"}=req.query;
 req.session.name=name;
 if(name==annonymous){
    req.flash("error","Name can't be empty");
 }
    else{
 req.flash("success","You are registered");
    }
res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
 res.render("page.ejs",{name:req.session.name});
});      


// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//  res.send(`Request count: ${req.session.count}`);
// })

//cookie-parsor
// const cookieparser=require("cookie-parser");
// app.use(cookieparser("secretcode"));

// //signed cookies
// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("signedCookie","signedValue",{signed:true});
//     res.send("send you some signed cookies");
    
// })

// app.get("verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified cookies")
// })

// app.get("/getcookies",(req,res)=>{
//     res.cookie("hello","namaste");
//     res.send("sendyou some cookies");
//     // res.cookie("")
// })
// app.use("/posts",posts);
// app.use("/users",user);

// app.get("/greet",(req,res)=>{
   
//     let {name="anonymous"}=req.cookies;
//     res.send(`Hi,${name}`);
// })
// app.get("/",(req,res)=>{
//     console.dir(req.cookies)
//     res.send("working")
// })
app.listen(3000,()=>{
    console.log("server is listening in 3000")
})