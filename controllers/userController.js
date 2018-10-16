var Climber = require('../models/climber');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

exports.index = function (req, res) {

    async.parallel({
        climb_count: function (callback) {
            Climb.countDocuments(callback);
        }
    }, function (err, results) {
        res.render('index', { title: 'Gym Climbing Home', error: err, data: results });
    });
};

exports.climb_list = function (req, res, next) {
// find({}, the fields we want returned, if we don't need all)
    Climb.find()
        .populate('gym')
        .populate('locations')
        .populate('setters')
        .exec(function (err, list_climbs) {
            if (err) { return next(err); }
            // Successful, so render
            // res.json(list_climbs);
            res.render('climb_list', { title: 'Climb List', climb_list: list_climbs });
        });

};