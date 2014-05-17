var request = require('request');

module.exports = function(req, res, next) {

	if (!req.headers.authorization) {
		return next();
	}
	request.get({
		url: 'https://graph.facebook.com/me?access_token='+req.headers.authorization
	}, function(error, response, json) {
		try {
	  		req.user = JSON.parse(json);
	  		next();
	  	} catch (ex) {
	  		next();
	  	}
	  });
	
}