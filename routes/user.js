let express = require('express'),
    router  = express.Router(),
    passport = require('passport'),
    User     = require('../models/user');

    router.get('/',function(req,res){
        res.render('../views/stories/home');
    })
    //register route
    router.get('/register',function(req,res){
        res.render('../views/users/register');
    })
    // handle register logic
    router.post('/register',function(req,res){
        let newUser = new User({username: req.body.username});
        User.register(newUser,req.body.password,function(err,user){
            if(err){
                req.flash('error',err.message);
                res.redirect('back');
            }else{
                passport.authenticate('local')(req,res,function(){
                    res.redirect('/stories');
                })
            }
        })
    })
    //login
    router.get('/login',function(req,res){
        res.render('../views/users/login');
    })
    //handle login logic
    router.post('/login',passport.authenticate('local',{
        successRedirect: '/stories',
        failureRedirect: '/login'
    }),function(req,res){});
    //logout logic
    router.get('/logout',function(req,res){
        req.logOut();
        req.flash('success','your are successfully logged out');
        res.redirect('/');
    })

    module.exports = router;