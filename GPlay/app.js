var bodyParser = require('body-parser');
var express = require('express');
var playlists = require('./routes/playlists');
var artists = require('./routes/artist');
var tracks = require('./routes/tracks');
var genres = require('./routes/genre');
var login = require('./routes/googlePlayLogin');
var interests = require('./routes/interests');

var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	"extended" : false
}));

router.get("/", function(req, res) {
	res.json({
		"error" : false,
		"message" : "Hello World"
	});
});

app.use('/api', login);
app.use('/api', genres);
app.use('/api', playlists);
app.use('/api', artists);
app.use('/api', tracks);
app.use('/api', interests);

module.exports = app;