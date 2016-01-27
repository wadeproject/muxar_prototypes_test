var express = require('express');
var PlayMusic = require('../node_modules/play');

var pm = new PlayMusic();
var router=express.Router();

router.route('/login')
.post(function(req,res){
	var username = req.body.email;
	var pwd = req.body.password;
	pm.login({
		email : username,
		password : pwd
	}, function(err) {
		var response = {
				status: 500,
				message: "Internal server error"
		};
		if(!err) {
			response.status = 200;
			response.message = "Ok";
	    }
		else{
			response.status = err.statusCode;
			response.message = err.response.statusMessage;
		}
		return res.json(response);
	});
	
});

module.exports=router;