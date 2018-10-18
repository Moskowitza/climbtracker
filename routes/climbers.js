// This is from our tutorial as index.js
//we already have an index route that taks us to the catalog
var express = require('express');
var passport = require('passport');
var Climber = require('../models/climber');
var Gym = require('../models/gym');
var router = express.Router();
var climber_controller = require('../controllers/climberController');

// KEEP AN EYE ON THIS ROUTE
router.get('/climber/:id', climber_controller.climber_profile_get);

router.get('/register', climber_controller.climber_register_get);

router.post('/register',climber_controller.climber_register_post);

router.get('/login', climber_controller.climber_login_get);

router.post('/login',climber_controller.climber_login_post);

router.get('/logout', climber_controller.climber_logout);

module.exports = router;