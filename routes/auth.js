var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");





router.get("/" , (req ,res)=>{
    res.redirect("/books");
});


router.get("/register" , (req , res)=>{
    res.render("register.ejs");
});
router.post("/register" , (req , res)=>{
    User.register(new User({username:req.body.username}) , req.body.password , (err , ret)=>{
        if(err)
        {
            console.log(err);
            req.flash("error" , err.message);
            return res.render("register.ejs");
        }
        else
        {
            req.flash("success" , "Registered Successfully. Please LogIn")
            res.redirect("/books");
        }
    } )
})

//LOGIN ROUTE
router.get("/login" , (req , res)=>{
    res.render("login.ejs");
});
router.post("/login" , passport.authenticate("local" , {
    successFlash:"Welcome to BookManiac",
    successRedirect:"/books" ,
    failureFlash:"Invalid Username or Password",
    failureRedirect:"/login"
}) , (req , res)=>{
    console.log("Login Succesful");
});

//LOGOUT ROUTE
router.get("/logout" , (req , res)=>{
    req.logout();
    req.flash("success" , "Logged Out Successfully");
    res.redirect("/books");
});

module.exports = router ;