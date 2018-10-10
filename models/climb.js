var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment'); // For date handling.

var ClimbSchema = new Schema({
    gym: { type: Schema.ObjectId, ref: 'Gym' },
    location: { type: Schema.ObjectId, ref: 'Wall' },
    type: {type: String, required: true, enum:['Boulder', 'Top Rope', 'Lead', 'Training'], default:'Boulder'},
    color: {type: String, required: true, max: 100},
    grade: {type: String, required: true, max: 100},
    // Optionals
    circuit:{type:String},
    date_of_set: { type: Date },
    date_of_removal: { type: Date },
    active:{type:Boolean},
    setter: { type: Schema.ObjectId, ref: 'Setter'},
    climb_image: {type:String},
});

ClimbSchema
.virtual('url')
.get(function () {
  return '/catalog/climb/'+this._id;
});
ClimbSchema
.virtual('imgurl')
.get(function () {
  return '/public/images/'+this.climb_image;
});

ClimbSchema
.virtual('date_of_set_yyyy_mm_dd')
.get(function () {
  return moment(this.date_of_set).format('YYYY-MM-DD');
});


module.exports = mongoose.model('Climb', ClimbSchema);