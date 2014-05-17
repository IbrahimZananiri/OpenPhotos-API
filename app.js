if (process.env.NODE_ENV == 'PRODUCTION' && process.env.NEW_RELIC_ENABLED && process.env.NEW_RELIC_LICENSE_KEY) {
	require('newrelic');
}
var	restify = require('restify')
,	mongoose = require('mongoose')
,	package = require('./package')
,	authenticator = require('./handlers/authenticator')
,	authorizor = require('./handlers/authorizor')
,	photosHandler = require('./handlers/photos')
,	newPhotoHandler = require('./handlers/new-photo')
,	loginHandler = require('./handlers/login')

var server = restify.createServer({
  name: package.name,
  version: package.version
});

if (process.env.NODE_ENV != 'PRODUCTION') {
	mongoose.set('debug', true);
}

mongoose.connection.on('error', function(err) { console.log('mongoose:', err) });

mongoose.connect((process.env.DB__URI || 'mongodb://127.0.0.1/ophotos'), function(err) {
	if (err) throw err;
	else console.log('Successfully connected to mongodb');
});


server.use(restify.queryParser());
server.use(restify.bodyParser({mapParams: false}));
server.use(restify.acceptParser(server.acceptable));
server.use(restify.requestLogger());


server.use(authenticator);

server.post('/users/:id/photos', newPhotoHandler);

server.get('/users/:id/photos', photosHandler);

server.post('/users', loginHandler);

server.get('/health', function(req, res, next) { res.send({up: true}); next() });


server.listen(process.env.PORT || 8888, function () {
  console.log('%s %s listening at %s', server.name, package.version, server.url);
});