var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var ClimbInstanceSchema = new Schema({
    climb: { type: Schema.ObjectId, ref: 'Climb', required: true }, // Reference to the associated climb.
    climber: { type: Schema.ObjectId, ref: 'Climber', required: true }, // Reference to the associated climb.
    status: {type: String, required: true, enum:['Not Tried', 'Attempt', 'Projecting', 'Climbed', 'Red Point', 'Flash'], default:'Not Tried'},
    counter: { type: Number, default:0},
    date: { type: Date, default: Date.now },
});

// Virtual for this bookinstance object's URL.


ClimbInstanceSchema
.virtual('date_formatted')
.get(function () {
  return moment(this.due_back).format('MMMM Do, YYYY');
});



// Export model.
module.exports = mongoose.model('ClimbInstance', ClimbInstanceSchema);