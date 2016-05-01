var express = require('express');
var router = {};
var path = require("path");
var request = require('request');
// var auth = require('../auth.js')
var auth = require('../auth_public.js');
var User = require('../models/model.js');
var Twote = require('../models/twoteModel.js') //Ummm...?

router.home = function(req, res, next) {
  res.sendFile('main.html', { root: path.join(__dirname, '../public') });
};

router.question = function(req, res, next) {
	console.log("got here");
	res.redirect('/')
	// res.sendFile('question.html', { root: path.join(__dirname, '../public') });
};

router.board = function(req, res, next) {
	Twote.find({})
	    .sort({_id: -1})
	    .populate('creator')
	    .exec(function(err, twotes) {
	        User.find({}, function(err, users) {
	            res.render('twoter', {
	                user: req.user,
	                twotes: twotes,
	                users: users
	            });
	        })
	    });
}

router.searchOverSleep = function(req, res, next){
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

router.searchSleepDep = function(req, res, next){
	var url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=sleep&section_name=Science&type_of_material=Blog&page=0&api-key="+auth.NYTIMES_API_KEY;
	// var url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=sleeping-in-feels-so-good-but-may-be-unhealthy&page=0&api-key="+auth.NYTIMES_API_KEY;

	request(url, function(error, response, body){
		var parse = JSON.parse(body);
		console.log(parse);
		// res.json(parse.response.docs);
		res.json(parse.response.docs[0].web_url);
		// res.json(parse.response.docs[2].web_url);
		// res.json(parse.response.docs[3].web_url);

		// res.json(parse.response.docs[0].web_url);


		// res.json(Object.keys(parse.response.docs[1].web_url));
	});
};

router.getUser = function(req, res) {
	res.json(req.user);
}

router.getTwotes = function(req, res) {
	Twote.find({})
	    .sort({_id: -1})
	    .populate('creator')
	    .exec(function(err, twotes) {
            res.json(twotes);
	    });
}

module.exports = router;
