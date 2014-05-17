var mongoose = require('mongoose')
,	Schema = mongoose.Schema
,	knox = require('knox')
,	os = require('os')

var photoSchema = new Schema({

	userDescription: { type: String, trim: true },
	user: { type: Number, required: true },
	createdAt: { type: Date, default: Date.now },

}, { collection: 'photo' });


var client = knox.createClient({
	key: process.env.AWS__KEY,
	secret: process.env.AWS__SECRET,
	bucket: process.env.AWS__BUCKET
});

photoSchema.methods.attach = function(attachment, cb) {
	var headers = {
		'x-amz-acl': 'public-read'
	}
	client.putFile(attachment.path, this.user+'/'+this.id+'.jpg', headers, function(err, uploadRes) {
	    if(err) return cb(err);
	    cb(null, attachment);
	  });
}

photoSchema.virtual('imageURL').get(function () {
	return client.http('/'+this.user+'/'+this.id+'.jpg');
});

photoSchema.virtual('thumbnailURL').get(function () {
	return client.http('/'+this.user+'/'+this.id+'.jpg');
});

photoSchema.set('toJSON', {
    virtuals: true
});

var Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;