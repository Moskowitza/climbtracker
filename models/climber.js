var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var moment = require('moment'); // For date handling.

var ClimberSchema = new Schema({
    username: {type: String, required: true, max: 100},
    password: {type: String},
    email: {type: String, required: true, max: 100},
   // Optionals
    date_of_birth: { type: Date },
    gender: {type:String},
    height_feet: {type:Number},
    height_inch: {type:Number},
    gym_memberships:[{ type: Schema.ObjectId, ref: 'Gym' }]
});
ClimberSchema
.virtual('date_of_birth_yyyy_mm_dd')
.get(function () {
  return moment(this.date_of_birth).format('YYYY-MM-DD');
});
ClimberSchema
.virtual('url')
.get(function () {
  return '/climber/'+this._id;
});

ClimberSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('Climber', ClimberSchema);