let express    = require('express'),
    router     = express.Router(),
    Story      = require('../models/story'),
    mid        = require('../midleware/index');
    
    //index route
    router.get('/stories',mid.isAuth,function(req,res){
        Story.find({},function(err,stories){
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('/');
            }else{
                res.render('../views/stories/index',{stories: stories});
            }
        })
    })
    // new route
    router.get('/stories/new',mid.isAuth ,function(req,res){
        res.render('../views/stories/new');
    })
    // create route
    router.post('/stories',mid.isAuth,(req,res)=>{
        let author = {id:req.user._id,username:req.user.username};
        let newPost = new Story({title: req.body.title, content:req.body.content,author:author});
        Story.create(newPost,function(err,post){
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                res.redirect('/stories');
            }
        })
    })
    //show route
    router.get('/stories/:id',function(req,res){
        Story.findById(req.params.id).populate('comments').exec(function(err,story){
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                res.render('../views/stories/show',{story:story});
            }
        })
    })
    //edit route
    router.get('/stories/:id/edit',mid.storyOwner,function(req,res){
        Story.findById(req.params.id,(err,story)=>{
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                res.render('../views/stories/edit',{story:story});
            }
        })
    })
    //update route
    router.put('/stories/:id',mid.storyOwner,function(req,res){
        Story.findByIdAndUpdate(req.params.id,req.body.story,function(err){
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                res.redirect('/stories/'+req.params.id);
            }
        })
    })
    //delete route
    router.delete('/stories/:id',mid.storyOwner,(req,res)=>{
        Story.findByIdAndDelete(req.params.id,function(err){
            if(err){
                console.log(err);
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                res.redirect('/stories');
            }
        })
    })

    module.exports = router