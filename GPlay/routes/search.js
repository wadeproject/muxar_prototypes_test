var express=require('express');
var fs = require('fs');
var PlayMusic = require('../node_modules/play');

var pm = new PlayMusic();
var router=express.Router();
var config = JSON.parse(fs.readFileSync("config.json"));

router.route('/search')
    .get(function(req,res){
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
    		var opts = {
    			limit: 100
    		};
    		
    		 pm.search(text, maxResults, callback)(opts, function(err, data) {
    			 console.log(data);
    		 return res.json(data);
    		 });
    	});
    })

    .post(function(req,res){
    	
    });

module.exports=router;
