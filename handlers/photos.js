var authorizor = require('./authorizor')
,	Photo = require('../models/photo')

module.exports = [authorizor, function(req, res, next) {

	Photo.find({user: req.user.id}).exec(function(err, photos) {
		if (err) return next(err);
		res.send(photos);
		return next();
	});

}];