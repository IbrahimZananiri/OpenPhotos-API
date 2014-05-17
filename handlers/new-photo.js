var	authorizor = require('./handlers/authorizor')
,	Photo = require('./models/photo')


module.exports = [authorizor, function(req, res, next) {

	var photo = new Photo;
	photo.userDescription = req.body.userDescription;
	photo.user = req.user.id;

	photo.attach(req.files.image, function(err) {
		if(err) return next(err);
		console.log('attach err', err);
		photo.save(function(err, doc) {
			console.log(err, doc);
			if (err) {
				return next();
			}
			var photoJson = doc.toJSON();
			res.send(photoJson);
			return next();
		});
	})

}];