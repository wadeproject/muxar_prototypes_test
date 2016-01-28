var express = require('express');
var request = require('request');
var SparqlClient = require('sparql-client');

var endpoint = 'http://dbpedia.org/sparql';
var router = express.Router();


router.route('/recommendation/associatedbands').get(function(req, res) {
	var band = req.body.band;
	var query = 'select ?bands where {\
		   ?bands dbo:associatedBand <' + band + '>.\
		   }';
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		callback(error, error ? null : results.results.bindings[0].person.value);
	});
});

router.route('/recommendation/commonsongs').get(function(req, res) {
	var artistF = req.body.artistF;
	var artistS = req.body.artistS;
	var query = 'select ?song where {\
	     		?song dbo:musicalArtist <' + artistF + '>;\
	            dbo:musicalArtist <' + artistS + '>.\
				}';
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		callback(error, error ? null : results.results.bindings[0].person.value);
	});
});

router.route('/recommendation/songsbygenre').get(function(req, res) {
	var artist = req.body.artist;
	var genre = req.body.genre;
	var query = 'select distinct ?song where {\
	    		?song dbp:name ?name;\
				rdf:type dbo:Single;\
				rdf:type dbo:MusicalWork;\
				dbp:artist <' + artist + '>;\
				dbo:genre <' + genre + '>.\
				}';
	var client = new SparqlClient(endpoint);
	client.query(query).execute(function(error, results) {
		callback(error, error ? null : results.results.bindings[0].person.value);
	});
});

module.exports = router;
