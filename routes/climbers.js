// This is from our tutorial as index.js
//we already have an index route that taks us to the catalog
var express = require('express');
var passport = require('passport');
var Climber = require('../models/climber');
var Gym = require('../models/gym');
var router = express.Router();
var climber_controller = require('../controllers/climberController');

// KEEP AN EYE ON THIS ROUTE
router.get('/:id', climber_controller.climber_profile_get);

router.get('/register', climber_controller.climber_register_get);

router.post('/register',climber_controller.climber_register_post);
//  function (req, res) {
//   Climber.register(new Climber({
//     username: req.body.username
//   }), req.body.password, function (err, climber) {
//     if (err) {
//       return res.render('register', { climber: climber });
//     }

//     passport.authenticate('local')(req, res, function () {
//       res.redirect('/');
//     });
//   });
// });

router.get('/login', function (req, res) {
  res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local'), function (req, res) {
  res.redirect('/');
});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function (req, res) {
  res.status(200).send("pong!");
});

module.exports = router;