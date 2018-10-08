var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var moment = require('moment'); // For date handling.

var ClimberSchema = new Schema({
    username: String,
    password: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Climber', ClimberSchema);