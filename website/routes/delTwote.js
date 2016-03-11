var Twote = require('../models/twoteModel.js');

var routes = {};

var handleError = function(err) {
	console.log(err);
}

routes.delTwotePOST = function(req, res) {
	Twote.findById(req.body.id, function (err, twote) {
		if (err) return handleError(err);

		// Delete entry
		twote.remove(function(err) {
			if (err) return handleError(err);
			res.send(twote);
		})
	});
};

module.exports = routes;