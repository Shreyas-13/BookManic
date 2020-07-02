var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var Review = require("../models/reviews");
var middleware = require("../middleware/middleware");


router.get("/books/:id/reviews/new" , middleware.logged , (req , res)=>{
    Book.findById(req.params.id , (err , ret)=>{
        if(err)
        {
            req.flash("error" , "Book Not Found. Can't create a comment!");
            console.log(err);
        }
        else
        {
            res.render("reviews/new.ejs" , {info : ret});
        }
    });
});

router.post("/books/:id/reviews" , middleware.logged , (req , res)=>{
    Book.findById(req.params.id , (err , book)=>{
        if(err)
        {
            
            req.flash("error" , "Book Not Found. Can't create a comment!");
            console.log(err);
        }
        
        else
        {
            Review.create(req.body.review , (err , ret)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    ret.Creator.id = req.user._id;
                    ret.Creator.Name = req.user.username;
                    ret.save();
                    console.log(ret);
                    book.reviews.push(ret);
                    book.save((err , ret)=>{
                        if(err)
                        {
                            console.log(err);
                          }
                        else
                        {
                            req.flash("success" , "Comment Created");
                            res.redirect("/books/" + req.params.id);
                        }
                    });
                }
            });
        }
    });

});

//EDIT & UPDATE ROUTE

router.get("/books/:id/reviews/:cid/edit" , middleware.checkOwnershipComment , (req , res)=>{
    Review.findById(req.params.cid , (err , ret)=>{
        if(err)
        {
            console.log(err);
            
            req.flash("error" , "Book Not Found. Can't edit the comment!");
            res.redirect("back");
        }
        else
        {
            
           
            res.render("reviews/edit.ejs" , {info : req.params.id , foundReview : ret});
        }
    });
});

router.put("/books/:id/reviews/:cid" , middleware.checkOwnershipComment , (req , res)=>{
    Review.findByIdAndUpdate(req.params.cid , req.body.review ,  (err , ret)=>{
        if(err)
        {
            
            req.flash("error" , "Book Not Found. Can't create a comment!");
            console.log(err);
            res.redirect("back");
        }
        else
        {
            req.flash("success" , "Comment Updated!");
            res.redirect("/books/"+req.params.id); 
        }
    })
});

//DELETE ROUTE

router.delete("/books/:id/reviews/:cid" , middleware.checkOwnershipComment , (req , res)=>{
    Review.findByIdAndDelete(req.params.cid , (err , ret)=>{
        if(err)
        {
            req.flash("error" , "Book Not Found. Can't delete the comment!");
            console.log(err);
            res.redirect("back");
        }
        else
        {
            req.flash("success" , "Comment Deleted");
            res.redirect("/books/"+req.params.id);
        }
    });
});

module.exports = router;