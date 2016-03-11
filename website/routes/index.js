var express = require('express');
var router = {};
var path = require("path");
var request = require('request');
// var auth = require('../auth.js')
var auth = require('../auth_public.js');



router.home = function(req, res, next) {
  res.sendFile('main.html', { root: path.join(__dirname, '../public') });
};

router.question = function(req, res, next) {
	console.log("got here");
  res.sendFile('question.html', { root: path.join(__dirname, '../public') });
};

router.search = function(rqe, res, next){
	var url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=sleep&section_name=Science&type_of_material=Blog&page=0&api-key="+auth.NYTIMES_API_KEY;
	request(url, function(error, response, body){
	var parse = JSON.parse(body);
	console.log(parse);
	res.json(parse);
	});
};

router.fbCallback = function(req, res, next) {
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    }
};

module.exports = router;
