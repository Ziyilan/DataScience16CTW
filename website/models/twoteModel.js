var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Twote = new Schema({
	text: String,
	creator: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Twote', Twote);