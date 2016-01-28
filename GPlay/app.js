var bodyParser = require('body-parser');
var express = require('express');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it

var playlists = require('./routes/playlists');
var artists = require('./routes/artist');
var genres = require('./routes/genre');
var login = require('./routes/googlePlayLogin');
var interests = require('./routes/interests');
var trackdata = require('./routes/trackData');

var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	"extended" : false
}));

app.use(cookieParser());
app.use(expressSession({secret:'somesecrettokenhere'}));
app.use(bodyParser());

router.get("/", function(req, res) {
	res.json({
		"error" : false,
		"message" : "Hello World"
	});
});

app.use('/api', login);
app.use('/api', genres);
app.use('/api', playlists);
//app.use('/api', artists);
app.use('/api', interests);
app.use('/api', trackdata);
app.use(express.static('public'));
module.exports = app;