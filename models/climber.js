var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var moment = require('moment'); // For date handling.
var passportLocalMongoose = require('passport-local-mongoose');


var ClimberSchema = new Schema({
    username: {type: String, required: true, max: 100},
    password: {type: String, required: true, max: 100},
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
  return '/catalog/climber/'+this._id;
});
ClimberSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

ClimberSchema.methods.validatePassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

ClimberSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

ClimberSchema.methods.toAuthJSON = function () {
  return {
      _id: this._id,
      email: this.email,
      token: this.generateJWT(),
  };
};

ClimberSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('Climber', ClimberSchema);