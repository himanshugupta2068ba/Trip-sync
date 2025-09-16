const express=require("express");
const app=express();
const posts=require("./routes/post.js");
const user=require("./routes/user.js")
//cookie-parsor
const cookieparser=require("cookie-parser");
app.use(cookieparser("secretcode"));

//signed cookies
app.get("/getsignedcookie",(req,res)=>{
    res.cookie("signedCookie","signedValue",{signed:true});
    res.send("send you some signed cookies");
    
})

app.get("verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("verified cookies")
})

app.get("/getcookies",(req,res)=>{
    res.cookie("hello","namaste");
    res.send("sendyou some cookies");
    // res.cookie("")
})
app.use("/posts",posts);
app.use("/users",user);

app.get("/greet",(req,res)=>{
    /* The line `let {name="anonymous"}=req.cookies;` is using object destructuring in JavaScript to
    extract the value of the "name" property from the `req.cookies` object. If the "name" property
    is not present in `req.cookies`, it will default to "anonymous". This line essentially assigns
    the value of the "name" property from `req.cookies` to the variable `name`, with a default value
    of "anonymous" if the property is not found. */
    let {name="anonymous"}=req.cookies;
    res.send(`Hi,${name}`);
})
app.get("/",(req,res)=>{
    console.dir(req.cookies)
    res.send("working")
})
app.listen(3000,()=>{
    console.log("server is listening in 3000")
})