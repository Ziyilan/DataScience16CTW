var Twote = require('../models/twoteModel.js');

var routes = {};

routes.newTwotePOST = function(req, res) {
	var text = req.body.twoteText;
	var thisTwote = new Twote({
		text: text,
		creator: req.user._id
	});
	thisTwote.save(function (err) {
		if (err) return handleError(err);
		Twote.populate(thisTwote, {path:"creator"}, function(err, twote) {
			res.send(twote);
		});
	});
};

module.exports = routes;