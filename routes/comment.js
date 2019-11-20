let express = require('express'),
    router  = express.Router();
let Comment = require('../models/comment');
let Story   = require('../models/story');
let mid     = require('../midleware/index');

//new route
router.get('/stories/:id/comments/new',mid.isAuth,function(req,res){
 Story.findById(req.params.id,(err,story)=>{
     if(err){
         console.log(err);
         req.flash('error',err.message);
         res.redirect('back');
     }else{
         res.render('../views/comments/new',{story:story});
     }
 })
})
// create route
router.post('/stories/:id/comments',mid.isAuth,function(req,res){
    Story.findById(req.params.id,(err,story)=>{
        if(err){
            console.log(err);
            req.flash('error',err.message);
            res.redirect('back');
        }else{
            let author = {id:req.user._id,username:req.user.username};
            let newComment = new Comment({text:req.body.text,author:author});
            Comment.create(newComment,(err,comment)=>{
                if(err){
                    console.log(err);
                    req.flash('error',err.message);
                    res.redirect('back');
                    
                }else{
                    story.comments.push(comment);
                    story.save();
                    res.redirect('/stories/'+req.params.id);
                }
            })

        }
    })    
})
//edit comment
router.get('/stories/:id/comments/:comment_id/edit',mid.commentOwner,function(req,res){
    Story.findById(req.params.id,(err,story)=>{
        if(err){
            console.log(err);
            req.flash('error',err.message);
            res.redirect('back');   
        } else {
            Comment.findById(req.params.comment_id,(err,comment)=>{
                if(err){
                    console.log(err);
                    req.flash('error',err.message);
                    res.redirect('back'); 
                }else{
                    res.render('../views/comments/edit',{story:story, comment:comment});
                }
            })
        }
    })
})
//update comment
router.put('/stories/:id/comments/:comment_id',mid.commentOwner,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err)=>{
        if(err){
            console.log(err);
            req.flash('error',err.message);
            res.redirect('back');
        }else{
            res.redirect('/stories/'+req.params.id);
        }
    })
})
// delete route
router.delete('/stories/:id/comments/:comment_id',mid.commentOwner,function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id,(err)=>{
        if(err){
            console.log(err);
            req.flash('error',err.message);
            res.redirect('back');
        }else{
            res.redirect('/stories/'+req.params.id);
        }
    })
})


module.exports = router;