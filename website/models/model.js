
var mongoose = require('mongoose');

var User = mongoose.Schema({
  oauthID: Number,
  name: String,
  created: Date
});

module.exports = mongoose.model("user", User);