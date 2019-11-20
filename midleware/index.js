let Story  = require('../models/story');
let Comment = require('../models/comment');

let check = {};

check.isAuth = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error','you need to be logged in first');
        res.redirect('/login');
        
    }
}
check.storyOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Story.findById(req.params.id,function(err,story){
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else if(story.author.id.equals(req.user._id)){
                return next();
            }else{

                req.flash('error','you do not have that permission');
                res.redirect('back');
            }
        })
        
    }else{
        res.redirect('/login');
    }
}
check.commentOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,comment){
            if(err){
                req.flash('error',err.message);
                res.redirect('back');
            }else if(comment.author.id.equals(req.user._id)){
                return next();
            }else{
                
                req.flash('error','you are not authorize to do that');
                res.redirect('back');
                
            }
        })
    }else{
        res.redirect('/login');
    }
}
module.exports = check;