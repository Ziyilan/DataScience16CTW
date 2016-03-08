//This type of file is usually found in app/models/robotModel.js
var mongoose = require('mongoose');

// Create a Schema
var twoteSchema = mongoose.Schema({
  content: String,
  author: String
});

module.exports = mongoose.model("twote", twoteSchema);

