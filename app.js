var	restify = require('restify')
,	mongoose = require('mongoose')
,	package = require('./package')
,	Photo = require('./models/photo')
,	request = require('request')

var server = restify.createServer({
  name: package.name,
  version: package.version
});

if (process.env.NODE_ENV != 'PRODUCTION') {
	mongoose.set('debug', true);
}

mongoose.connection.on('error', function(err) { console.log('mongoose error', err) });

mongoose.connect((process.env.DB__URI || 'mongodb://127.0.0.1/ophotos'), function(err) {
	if (err) throw err;
	else console.log('Successfully connected to mongodb');
});


server.use(restify.queryParser());
server.use(restify.bodyParser({mapParams: false}));
server.use(restify.acceptParser(server.acceptable));
server.use(restify.requestLogger());

server.use(function(req, res, next) {
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
});

var auth = function(req, res, next) {
	if (req.user) {
		return next();
	} else {
		res.send(403);
		return next();
	}
}

server.post('/users/me/photos', [auth, function(req, res, next) {

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

}]);

server.get('/users/me/photos', [auth, function(req, res, next) {

	Photo.find({user: req.user.id}).exec(function(err, photos) {
		if (err) return next(err);
		res.send(photos);
		return next();
	});

}]);


server.post('/users', [auth, function(req, res, next) {
	res.send({});
	next();
}]);


server.listen(process.env.PORT || 8888, function () {
  console.log('%s %s listening at %s', server.name, package.version, server.url);
});