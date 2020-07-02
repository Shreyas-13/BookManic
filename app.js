var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
var passport = require("passport");
var localStrategy = require("passport-local");
var flash = require("connect-flash");


var User = require("./models/user");
var authRoute = require("./routes/auth");
var bookRoute = require("./routes/books");
var reviewRoute = require("./routes/reviews");

//Config
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
mongoose.connect("mongodb://localhost/undecided" , {useNewUrlParser:true , useUnifiedTopology:true , useFindAndModify:false});
app.use(methodOverride("_method"));
app.use(express.static("public"));


//PASSPORT CONFIG

app.use(require("express-session")({
    secret:"1302sh",
    resave:false,
    saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ADDING MIDDLEWARE TO ALL ROUTES

app.use((req , res , next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(authRoute);
app.use(bookRoute);
app.use(reviewRoute);




app.listen(3000 , ()=>{
    console.log("Server has Started");
});

