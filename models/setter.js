var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var moment = require('moment'); // For date handling.

var SetterSchema = new Schema({
    username: {type: String, required: true, max: 100},
    password: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
   // Optionals
    date_of_birth: { type: Date },
    gender: {type:String},
    height_feet: {type:Number},
    height_inch: {type:Number},
    Gym_Memberships:[{ type: Schema.ObjectId, ref: 'Gym' }]
});
SetterSchema
.virtual('date_of_birth_yyyy_mm_dd')
.get(function () {
  return moment(this.date_of_birth).format('YYYY-MM-DD');
});

ClimberSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Setter', SetterSchema);