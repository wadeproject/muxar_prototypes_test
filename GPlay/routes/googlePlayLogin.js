var express = require('express');
var PlayMusic = require('../node_modules/play');
var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it



var pm = new PlayMusic();
var router = express.Router();

function getUserUri(user) {
	console.log("Insert");
	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');

	var query = 'select ?url from <http://wadeproject.com/> where {\
	       		?url foaf:name ?name.\
	    	       filter(regex(?name, "' + user + '", "i"))\
	    		} limit 1';

	console.log(query);
	request({
		url : 'http://192.168.99.100:8890/DAV',
		method : 'POST',
		headers : {
			'Content-Type' : 'application/sparql-query',
			'Accept' : 'application/json',
			'Authorization' : auth
		},
		body : query
	}, function(error, response, body) {
		if (error) {
			console.log(error);
		} else {
			console.log(body);
			// return response.json(body);
		}
	});
}

//TODO save user uri, auth data to session
router.route('/login').post(function(req, res) {
	var config = {
		email: req.body.email,
		password: req.body.password
	};
	pm.login(config, function(err, resp) {
		var response = {
			status : 500,
			message : "Internal server error"
		};
		if (!err) {
			response.status = 200;
			response.message = "Ok";
			req.session.androidId = resp.androidId;
			req.session.password = config.pwd;
			req.session.email = config.email;
			req.session.masterToken = resp.masterToken;
			console.log(req.session);
		} else {
			response.status = err.statusCode;
			response.message = err.response.statusMessage;
		}
		return res.json(response);
	});

});

module.exports = router;