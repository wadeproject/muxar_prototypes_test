var express = require('express');
var fs = require('fs');
var PlayMusic = require('../node_modules/play');
var request = require('request');
var SparqlClient = require('sparql-client');
var util = require('util');


var endpoint = 'http://dbpedia.org/sparql';
var pm = new PlayMusic();
var router = express.Router();
var config = JSON.parse(fs.readFileSync("config.json"));

function getArtistURI(artist, callback) {
	console.log("getArtistUri");
	var query = 'select distinct ?person where {\
	    		?person dbp:name ?name;\
				rdf:type dbo:MusicalArtist.\
				filter(regex(?name, "' + artist + '", "i"))\
				} limit 1';
	console.log(query);
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		callback(error, error ? null : results.results.bindings[0].person.value);
	});
}

function getTrackURI(trackName, artistUri, callback) {
	console.log("getTrack");
	var query = 'select distinct ?song where {\
	    ?song dbp:name ?name;\
		rdf:type dbo:Single;\
		rdf:type dbo:MusicalWork;\
		dbp:artist <' + artistUri + '>\
		filter(regex(?name, "' + trackName + '", "i"))\
		} limit 1';
	console.log(query);
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		callback(error, error ? null : results.results.bindings[0].song.value);
	});
}

function getAlbumURI(albumName, artistUri, callback) {
	console.log("getalbum");
	var query = 'select distinct ?album where {\
	    ?album dbp:name ?name;\
		rdf:type dbo:Album;\
		rdf:type dbo:MusicalWork;\
		dbp:artist <' + artistUri + '>\
		filter(regex(?name, "' + albumName + '", "i"))\
		} limit 1';
	console.log(query);
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		callback(error, error ? null : results.results.bindings[0].album.value);
	});
}

function insertArtistUri(artistUri) {
	console.log("Insert");
	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');

	var query = 'prefix dbo: <http://dbpedia.org/ontology/>\
		insert data into <http://wadeproject.com/> {\
	       <http://wadeproject.com/users/user1> foaf:interest <' + artistUri + '>.\
	       <' + artistUri + '> rdf:type dbo:MusicalArtist.\
	}';

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

function insertTrackUri(trackUri) {
	console.log("Insert");
	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');

	var query = 'prefix dbo: <http://dbpedia.org/ontology/>\
				insert data into <http://wadeproject.com/> {\
		       <http://wadeproject.com/users/user1> foaf:interest <' + trackUri + '>.\
		    	<' + trackUri + '> rdf:type dbo:Single;\
		            rdf:type dbo:MusicalWork.\
				}\
				}';

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
		}
	});
}

function insertAlbumUri(albumUri) {
	console.log("Insert");
	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');

	var query = 'prefix dbo: <http://dbpedia.org/ontology/>\
				insert data into <http://wadeproject.com/> {\
		        <http://wadeproject.com/users/user1> foaf:interest <' + albumUri + '>.\
		        <' + albumUri + '> rdf:type dbo:Album;\
		            rdf:type dbo:MusicalWork.\
				}';

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
		}
	});
}

//TODO execute calls in synchronized order
router.route('/trackData').get(function(req, res) {
	pm.login({
		email : config.email,
		password : config.password
	}, function(err, resp) {
		console.log(err, resp);
	});

	pm.init(config, function(err) {
		if (err) {
			return console.log("error", err);
		}
		pm.getPlayListEntries(function(err, data) {
			for (var index = 0; index < data.data.items.length; ++index) {
				var item = data.data.items[index];
				var artistName = item.track.artist;
				var trackName = item.track.title;
				var albumName = item.track.album;
				
				var artistUri = getArtistURI(artistName, function(err, data) {
					console.log(data);
					insertArtistUri(data);
				});
				getTrackURI(trackName, artistUri, function(err, data) {
					console.log(data);
					insertTrackUri(data);
				});
				getAlbumURI(albumName, artistUri, function(err, data) {
					console.log(data);
					insertAlbumUri(data);
				});
			}
			return res.json(data);
		});
	});
});

module.exports = router;
