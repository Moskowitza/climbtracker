var Gym = require('../models/gym');
var Climber = require('../models/climber');
var passport = require('passport');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

exports.climber_profile_get = function (req, res, next) {
    res.send("climber_profile_get not Implemented");
    // We'll fix this up soon
    // async.parallel({
    //     climber: function (callback) {
    //         Climber.find(callback);
    //     },function (err, results) {
    //         if (err) { return next(err); }
    //         res.render('climberprofile', { title: 'climberProfile', climber: results.climber });
    //     });
};

// We are going to render the register page
exports.climber_register_get = function (req, res, next) {
    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        gyms: function (callback) {
            Gym.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('register', { title: 'Register for climb Tracker', gyms: results.gyms });
    });

};



exports.climber_register_post = [

    (req, res, next) => {
        if (!(req.body.gym_memberships instanceof Array)) {
            if (typeof req.body.gym_memberships === 'undefined')
                req.body.gym_memberships = [];
            else
                req.body.gym_memberships = new Array(req.body.gym_memberships);
        }
        next();
    },
    body('username', 'username must not be empty.').isLength({ min: 1 }).trim(),
    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),
    sanitizeBody('gym_memberships.*').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        var climber = new Climber({
            username: req.body.username,
            // password:req.body.password,
            email: req.body.email,
            date_of_birth: req.body.date_of_birth,
            gender: req.body.gender,
            height_feet: req.body.height_feet,
            height_inch: req.body.height_inch,
            gym_memberships: req.body.gym_memberships
        });
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            // Get all  and gym_memberships for form.
            async.parallel({
                gyms: function (callback) {
                    Gym.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.gyms.length; i++) {
                    if (climber.gym_memberships.indexOf(results.gyms[i]._id) > -1) {
                        results.gyms[i].checked = 'true';
                    }
                }
                res.render('register', { title: 'Register for climb Tracker', gyms: results.gyms });
            });
            return;
        }
        else {
            console.log("HEY, we made it to else")
            Climber.register(climber, req.body.password, function (err, climber) {
                if (err) {
                    async.parallel({
                        gyms: function (callback) {
                            Gym.find(callback);
                        },
                    }, function (err, results) {
                        if (err) { return next(err); }
                        for (let i = 0; i < results.gyms.length; i++) {
                            if (req.body.gym_memberships.indexOf(results.gyms[i]._id) > -1) {
                                results.gyms[i].checked = 'true';
                            }
                        }
                        res.render('register', { title: 'Register error', climber: climber, gyms: results.gyms });
                    })
                }
                //     async.parallel({
                //         gyms: function (callback) {
                //             Gym.find(callback);
                //         },
                //     }, function (err, results) {
                //         if (err) { return next(err); }
                //         // Mark our selected genres as checked.
                //         for (let i = 0; i < results.gyms.length; i++) {
                //             if (climber.gym_memberships.indexOf(results.gyms[i]._id) > -1) {
                //                 results.gyms[i].checked = 'true';
                //             }
                //         }
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/');
                    // res.send('registration worked');
                    // res.redirect(climber.url);
                });
            });
        }
    }
]

exports.climber_login_get = function (req, res, next) {
    res.send("Login GET route");
    // res.render('login', { user: req.user })
}
exports.climber_login_post = function (req, res, next) {
    res.send("Login POST route");
    // res.render('login', { user: req.user })
}