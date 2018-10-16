var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
// https://mherman.org/blog/local-authentication-with-passport-and-express-4/
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// in passport tutorial it's like this:
// var routes = require('./routes/index');
// var users = require('./routes/users');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users'); //for login
var climbRouter = require('./routes/climbs');  //Import routes for "climbs" area of site

var app = express();
//Set up mongoose connection
var mongoose = require('mongoose');
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
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
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
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/climbs', climbRouter);
//This is the index file in the tutorial
app.use('/users', usersRouter); 

//passport config
var Climber = require('./models/climber');
passport.use(new LocalStrategy(Climber.authenticate()));
passport.serializeUser(Climber.serializeUser());
passport.deserializeUser(Climber.deserializeUser());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
