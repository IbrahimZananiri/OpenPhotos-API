var request = require('request');

module.exports = function(req, res, next) {

	if (!req.headers.authorization) {
		return next();
	}
	request.get({
		url: 'https://graph.facebook.com/me?access_token='+req.headers.authorization
	}, function(error, response, json) {
		try {
			if (response && response.statusCode == 200)
		  		req.user = JSON.parse(json);
	  	} catch (ex) {
	  		console.log(ex);
	  	}
	  	next();
	  });
	
}