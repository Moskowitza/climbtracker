var Gym = require('../models/gym');
var Climber = require('../models/climber');
var passport = require('passport');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

exports.climber_profile_get = function (req, res, next) {
    // res.send("climber_profile_get not Implemented");
    // We'll fix this up soon
    async.parallel({
        climber: function (callback) {

            climber.findById(req.params.id)
                .populate('gyms')
                //   .populate('genre')
                .exec(callback);
        },
        // book_instance: function(callback) {

        //   BookInstance.find({ 'book': req.params.id })
        //   .exec(callback);
        // },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.book == null) { // No results.
            var err = new Error('Climber not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('climber', { title: 'Climber Name', climber: results.climber });
    });

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
                        res.render('register', { title: 'Register error', climber: req.climber, gyms: results.gyms, error: err.message });
                    })
                }

                passport.authenticate('local')(req, res, function () {
                    req.session.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        res.redirect(climber.url);
                    });
                });
            })
        }
    }
]

exports.climber_login_get = function (req, res, next) {
    res.render('login', { climber: req.climber })
}
exports.climber_login_post = function (req, res, next) {
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
        req.session.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
}

exports.climber_logout = function (req, res, next) {
    req.logout();
    res.redirect('/');
}