const express=require("express");
const app=express();

//index - users
app.get("/users",(req,res)=>{
    req.send("GET for users");
})
//show-users
app.get("/users/:id",(req,res)=>{
    res.send("Get for show users");
})

//post routes
app.post("/users",(req,res)=>{
    res.send("POST ")
})

//delete user
app.delete("/users/:id",(req,res)=>{
    res.send("Delete for users")
})


//posts
//index 
app.get("/posts",(req,res)=>{
    req.send("GET for posts");
})
//show-users
app.get("/posts/:id",(req,res)=>{
    res.send("Get for show posts");
})

//post routes
app.post("/posts",(req,res)=>{
    res.send("POST ")
})

//delete posts
app.delete("/posts/:id",(req,res)=>{
    res.send("Delete for users")
})

app.get("/",(req,res)=>{
    res.send("working")
})
app.listen(3000,()=>{
    console.log("server is listening in 3000")
})