var express = require('express');
var router = {};
var path = require("path");
var request = require('request');



router.home = function(req, res, next) {
  res.sendFile('main.html', { root: path.join(__dirname, '../public') });
};

router.question = function(req, res, next) {
	console.log("got here");
  res.sendFile('question.html', { root: path.join(__dirname, '../public') });
};

router.search = function(rqe, res, next){
	var url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=sleep%20deprive%20health&page=1&sort=newest&api-key=a25ad4c53965626d48d407fad419435c:5:74652802";
	request(url, function(error, response, body){
	var parse = JSON.parse(body);
	console.log(parse);
	res.json(parse);
	});
};

module.exports = router;
