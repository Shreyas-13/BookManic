var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var middleware = require("../middleware/middleware");


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};




//Index Route
router.get("/books" , (req , res)=>{
    if(req.query.search)
    {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Book.find({title : regex} , (err , ret)=>{
            if(err)
            {
                console.log(err);
                req.flash("error" , "Error Encountered!");
            }
            else
            {
                res.render("books/index.ejs" , {info : ret});
            }
        });    
    }
    else
    {
        Book.find({} , (err , ret)=>{
            if(err)
            {
                console.log(err);
                req.flash("error" , "Error Encountered!");
            }
            else
            {
                res.render("books/index.ejs" , {info : ret});
            }
        })
    }

});

//New Route
router.get("/books/new" , middleware.logged , (req , res)=>{
    res.render("books/new.ejs");
});

//Create Route

router.post("/books" , middleware.logged , (req , res)=>{
    req.body.book.desc = req.sanitize(req.body.book.desc);
    Book.create(req.body.book , (err , ret)=>{
        if(err)
        {
            req.flash("error" , "Error Encountered!");
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
            req.flash("error" , "Book Not Found!");
            res.redirect("/books");
        }
        else
        res.render("books/show.ejs" , {info : ret});
    });
});

//Edit Route
router.get("/books/:id/edit" , middleware.checkOwnership , (req , res)=>{
    Book.findById(req.params.id , (err , ret)=>{
        if(err)
        {
            req.flash("error" , "Book Not Found!");
            res.redirect("back");
        }
        else
        {
            res.render("books/edit.ejs" , {info : ret});
        }
    });
});

//Update Route

router.put("/books/:id" , middleware.checkOwnership , (req , res)=>{
    req.body.book.desc = req.sanitize(req.body.book.desc);
    Book.findByIdAndUpdate(req.params.id , req.body.book , (err , ret)=>{
        if(err)
        {
            console.log(err);
            req.flash("error" , "Book Not Found!");
            res.redirect("back");
        }
        else
        {
            req.flash("success" , "Updated Successfully");
            res.redirect("/books/"+req.params.id);
        }
    });
});

//Delete Route
router.delete("/books/:id" , middleware.checkOwnership , (req , res)=>{
    Book.findByIdAndRemove(req.params.id , (err , ret)=>{
        if(err)
        {
            req.flash("error" , "Book Not Found!");
            res.redirect("/books/" + req.params.id);
        }
        else
        {
            req.flash("success" , "Deleted!")
            res.redirect("/books");
        }
    });
});



module.exports = router;