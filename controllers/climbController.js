var Climb = require('../models/climb');

// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

exports.index = function(req, res) {

    async.parallel({
        climb_count: function(callback) {
            Climb.countDocuments(callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Gym Climbing Home', error: err, data: results });
    });
};

