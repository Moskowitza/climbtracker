var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var GymSchema = new Schema({
    gymname: {type: String, required: true, max: 100},
    address: {type: String, required: true, max: 100},
    city: {type: String, required: true, max: 100},
    state: {type: String, required: true, max: 100},
    zipcode: {type: Number, required: true, max: 100000},
    website:{type: String, required: true, max: 100}
});

module.exports = mongoose.model('Gym', GymSchema);