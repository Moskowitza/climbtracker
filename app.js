var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
// https://mherman.org/blog/local-authentication-with-passport-and-express-4/
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

// in passport tutorial it's like this:
// var routes = require('./routes/index');
// var users = require('./routes/users');
var indexRouter = require('./routes/index');
var climberRouter = require('./routes/climbers'); //for login
var climbRouter = require('./routes/climbs');  //Import routes for "climbs" area of site

var app = express();
// view engine setup  (Not sure why pug is being weird now)
app.engine('pug', require('pug').__express)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', indexRouter);
app.use('/climbs', climbRouter);
//This is the index file in the tutorial
app.use('/climber',climberRouter); 



//error logger and whatever we need cors for
app.use(logger('dev'));
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//Set up mongoose connection
var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/climbtracker'
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
require('./models/climb');
require('./models/climber');
require('./models/climbInstance');
require('./models/gym');
require('./models/setter');
require('./models/wall');
// requires the model with Passport-Local Mongoose plugged in
var Climber = require('./models/climber');
// Climber.createStrategy();
// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
// passport.use(Climber.createStrategy());
passport.use(new LocalStrategy(Climber.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(Climber.serializeUser());
passport.deserializeUser(Climber.deserializeUser());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

module.exports = app;
