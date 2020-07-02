var Book  = require("../models/book");
var Review = require("../models/reviews");


var middleware={};

middleware.logged = function(req , res, next)
{
    if(req.isAuthenticated())
    {
        next();
    }
    else
    {
        res.redirect("/login");
    }
}

middleware.checkOwnership = function(req , res , next)
{
    if(req.isAuthenticated())
    {
        Book.findById(req.params.id , (err , ret)=>{
            if(err)
            {
                res.redirect("back");
            }
            else
            {
                if(ret.Creator.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        res.redirect("back");
    }
}

middleware.checkOwnershipComment = function(req , res , next)
{
    if(req.isAuthenticated())
    {
        Review.findById(req.params.cid , (err , ret)=>{
            if(err)
            {
                res.redirect("back");
            }
            else
            {
                if(ret.Creator.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        res.redirect("back");
    }
}

module.exports = middleware;