var Gym = require('../models/gym');
var Climber = require('../models/climber');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

exports.climber_profile_get = function(req, res, next) {
res.send("climber profile")
};

// We are going to render the register page
exports.climber_register_get = function(req, res, next) {

    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        gyms: function(callback) {
            Gym.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('register', { title: 'Create Book',gyms:results.gyms, genres:results.genres });
    });

};


// Handle book create on POST.
exports.climber_create_post = [
    // Convert the Gyms to an array.
    (req, res, next) => {
        if(!(req.body.gym instanceof Array)){
            if(typeof req.body.gym==='undefined')
            req.body.gym=[];
            else
            req.body.gym=new Array(req.body.gym);
        }
        next();
    },

    // Validate fields.
    body('username', 'username must not be empty.').isLength({ min: 1 }).trim(),
    body('password', 'Password must not be empty.').isLength({ min: 1 }).trim(),
    body('email', 'Email must not be empty.').isLength({ min: 1 }).trim(),
  
    // Sanitize fields.
    sanitizeBody('*').trim().escape(),
    sanitizeBody('gym.*').trim().escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var climber = new Climber(
          { username: req.body.title,
            password: req.body.password,
            date_of_birth: req.body.date_of_birth,
            gender: req.body.gender,
            height_feet: req.body.height_feet,
            height_inch:req.body.height_inch,
            gym_memberships:req.body.gym_memberships
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all gyms for form again.
            async.parallel({
                // climbers: function(callback) {
                //     Climber.find(callback);
                // },
                gyms: function(callback) {
                    Gym.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected gyms as checked.
                for (let i = 0; i < results.gyms.length; i++) {
                    if (climber.gym.indexOf(results.gyms[i]._id) > -1) {
                        results.gyms[i].checked='true';
                    }
                }
                res.render('register', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save climber.
            climber.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new climber record.
                   res.redirect(climber.url);
                });
        }
    }
];

exports.climber_login_get= function(req, res, next) {
    res.send("Login get route");
    // res.render('login', { user: req.user })
}
exports.climber_login_post= function(req, res, next) {
    res.send("Login POST route");
    // res.render('login', { user: req.user })
}