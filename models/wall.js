var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WallSchema = new Schema({
    gym: { type: Schema.ObjectId, ref: 'Gym' },
    name: {type: String, required: true, max: 100},
    attributes: [{type: String, required: true, max: 100}],
    wall_image: {type:String},
});

module.exports = mongoose.model('Wall', WallSchema);