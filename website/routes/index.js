var express = require('express');
var router = {};
var path = require("path");
var request = require('request');
var auth = require('../auth.js')



router.home = function(req, res, next) {
  res.sendFile('main.html', { root: path.join(__dirname, '../public') });
};

router.question = function(req, res, next) {
	console.log("got here");
  res.sendFile('question.html', { root: path.join(__dirname, '../public') });
};

router.search = function(rqe, res, next){
	// var url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=sleep&section_name=Science&type_of_material=Blog&page=0&api-key="+auth.NYTIMES_API_KEY;
	var url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=sleeping-in-feels-so-good-but-may-be-unhealthy&page=0&api-key="+auth.NYTIMES_API_KEY;

	request(url, function(error, response, body){
	var parse = JSON.parse(body);
	console.log(parse);
	// res.json(parse.response.docs);
	// res.json(parse.response.docs[0].web_url);
	// res.json(parse.response.docs[2].web_url);
	// res.json(parse.response.docs[3].web_url);

	res.json(parse.response.docs[0].web_url);


	// res.json(Object.keys(parse.response.docs[1].web_url));
	});
};

module.exports = router;
