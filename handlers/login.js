var authorizor = require('./handlers/authorizor')

module.exports = [auth, function(req, res, next) {
	res.send({});
	next();
}]