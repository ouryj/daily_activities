let express             = require('express'),
    app                 = express(),
    User                = require('./models/user'),
    flash               = require('connect-flash'),
    mongoose            = require('mongoose'),
    passport            = require('passport'),
    userRoute           = require('./routes/user'),
    storyRoute          = require('./routes/story'),
    bodyParser          = require('body-parser'),
    commentRoute        = require('./routes/comment'),
    localPassport       = require('passport-local'),
    methodOverride      = require('method-override');

    //connect mongoose 
    mongoose.connect('mongodb://localhost:27017/daily_story',{useNewUrlParser:true,useUnifiedTopology:true});
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    //set up basics
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(methodOverride('_method'));
    app.use(flash());
    app.set('view engine','ejs');
    

    // config passport
    app.use(require('express-session')({
        secret: 'post your story',
        resave: false,
        saveUninitialized: false
        
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new localPassport(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());


    app.use(function(req,res,next){
        res.locals.currentUser = req.user;
        res.locals.error      = req.flash('error');
        res.locals.success    = req.flash('success');
        next();
    })
    
    //set up routes
    app.use(userRoute);
    app.use(storyRoute);
    app.use(commentRoute);



    //fire up server
    app.listen(3000,function(){
        console.log('check your story on port 3000');
    })
    
