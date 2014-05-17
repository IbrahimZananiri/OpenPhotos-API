module.exports = function(req, res, next) {

	if (req.user) {
		return next();
	} else {
		res.send(403);
		return next();
	}
	
}