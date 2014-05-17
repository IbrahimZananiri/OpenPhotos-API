var authorizor = require('./authorizor')

module.exports = [authorizor, function(req, res, next) {
	res.send({});
	next();
}]