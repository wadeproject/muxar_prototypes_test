var express = require('express');
var fs = require('fs');
var PlayMusic = require('../node_modules/play');
var request = require('request');
var SparqlClient = require('sparql-client');
var util = require('util');

var router = express.Router();

//TODO 
router.route('/interests/artists').get(function(req, res) {
	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');
	request({
		url : 'http://192.168.99.100:8890/DAV',
		method : 'POST',
		headers : {
			'Content-Type' : 'application/sparql-query',
			'Accept' : 'application/json',
			'Authorization' : auth
		},
		body : 'prefix dbo: <http://dbpedia.org/ontology/>\
			select ?artist from <http://wadeproject.com/> where {\
			       <http://wadeproject.com/users/user1> foaf:interest ?artist.\
			       ?artist rdf:type dbo:MusicalArtist.\
			}'
	}, function(error, response, body) {
		if (error) {
			console.log(error);
		} else {
			return res.json(body);
		}
	});
});

router.route('/interests/albums').get(function(req, res) {
	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');
	request({
		url : 'http://192.168.99.100:8890/DAV',
		method : 'POST',
		headers : {
			'Content-Type' : 'application/sparql-query',
			'Accept' : 'application/json',
			'Authorization' : auth
		},
		body : 'prefix dbo: <http://dbpedia.org/ontology/>\
			select ?album from <http://wadeproject.com/> where {\
			       <http://wadeproject.com/users/user1> foaf:interest ?album.\
			       ?album rdf:type dbo:MusicalWork;\
			              rdf:type dbo:Album.\
			}'
	}, function(error, response, body) {
		if (error) {
			console.log(error);
		} else {
			return res.json(body);
		}
	});
});

router.route('/interests/songs').get(function(req, res) {
	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');
	request({
		url : 'http://192.168.99.100:8890/DAV',
		method : 'POST',
		headers : {
			'Content-Type' : 'application/sparql-query',
			'Accept' : 'application/json',
			'Authorization' : auth
		},
		body : 'prefix dbo: <http://dbpedia.org/ontology/>\
			select ?song from <http://wadeproject.com/> where {\
			       <http://wadeproject.com/users/user1> foaf:interest ?song.\
			       ?song rdf:type dbo:MusicalWork;\
			              rdf:type dbo:Single.\
			}'
	}, function(error, response, body) {
		if (error) {
			console.log(error);
		} else {
			return res.json(body);
		}
	});
});

module.exports = router;
