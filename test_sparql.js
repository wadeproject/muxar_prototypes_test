
var http = require('http');
var fs = require('fs');


function DoSparql(query) {

	var auth = 'Basic ' + new Buffer('dav' + ':' + 'dav').toString('base64');

  var options = {
      host: '192.168.99.100',
      port: '8890',
      path: '/DAV',
      method: 'POST',
      headers: {
          'Content-Type': 'application/sparql-query',
		  'Accept': 'application/json',
		  'Authorization': auth
      }
  };

  // Set up the request
  var post_req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write(query);
  post_req.end();
}


DoSparql("insert data into <http://wadeproject.com/> { <http://wadeproject.com/users/user1> foaf:name \"user1\".}");