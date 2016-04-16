
var mongoose = require('mongoose');

var User = mongoose.Schema({
  oauthID: Number, // is this stored as a number or as a string?
  name: String,
  created: Date
});

module.exports = mongoose.model("user", User);
// model.js is maybe not the best name for this file -- userModel.js?
