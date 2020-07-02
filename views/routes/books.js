var express = require("express");
var Book = require("../models/book");
var router = express.Router();


router.get("/" , (req ,res)=>{
    res.redirect("/books");
});

//Index Route
router.get("/books" , (req , res)=>{
    Book.find({} , (err , ret)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("./books/index.ejs" , {info : ret});
        }
    })
});

//New Route
router.get("/books/new" , logged , (req , res)=>{
    res.render("./books/new.ejs");
});

//Create Route

router.post("/books" , logged , (req , res)=>{
    req.body.book.desc = req.sanitize(req.body.book.desc);
    Book.create(req.body.book , (err , ret)=>{
        if(err)
        {
            res.redirect("/books/new");
        }
        else
        {
            ret.Creator.id = req.user._id;
            ret.Creator.Name = req.user.username;
            ret.save();
            console.log(ret);
            res.redirect("/books");
        }
    });
});

//Show Route
router.get("/books/:id" , (req , res)=>{
    Book.findById(req.params.id).populate("reviews").exec((err , ret)=>{
        if(err)
        {
            res.redirect("/books");
        }
        else
        res.render("./books/show.ejs" , {info : ret});
    });
});

//Edit Route
router.get("/books/:id/edit" , checkOwnership , (req , res)=>{
    Book.findById(req.params.id , (err , ret)=>{
        if(err)
    {
        res.render("./books/show.ejs");
    }
    else
    {
        res.render("./books/edit.ejs" , {info : ret});
    }
    });

//Update Route
router.put("/books/:id" , checkOwnership , (req , res)=>{
    req.body.book.desc = req.sanitize(req.body.book.desc);
    Book.findByIdAndUpdate(req.params.id , req.body.book , (err , ret)=>{

        if(err)
        {
            res.redirect("/books/:id/edit");
        }
        else
        {
            res.redirect("/books/" +req.params.id );
        }
    })
});    
});

//Delete Route
router.delete("/books/:id" , checkOwnership , (req , res)=>{
    Book.findByIdAndRemove(req.params.id , (err , ret)=>{
        if(err)
        {
            res.redirect("/books/" + req.params.id);
        }
        else
        {
            res.redirect("/books");
        }
    });
});
