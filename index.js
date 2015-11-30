//Dependencies
var express		= require('express');

//Initializations
var app 	= express();
var router 	= express.Router();

router.route('/users')
	/*
	*	Route for listing all users
	*	GET /api/users
	*/
	.get(function(req, res) {
		try
		{
			res.status(200).json({ message : 'Here are all my users' });
		}
		catch(e)
		{
			console.log('Error occured on GET /api/users ' + e);
			res.status(500).json({ errno : '500', message : 'An unspecified error occured' });
		}
	});
	
/*
*	Route for accessing users by id.	
*/
router.route('/users/:user_id')
	/*
	*	Returns the username of the specified user id
	*	GET /api/users/:user_id
	*/
	.get(function(req, res) {
		try
		{	
			res.status(200).json({ id : req.params.user_id, message : 'Here\'s the user id' });
		}
		catch(e)
		{
			console.log('Error occured on GET /api/users/:user_id ' + e);
			res.status(500).json({ errno : '500', message : 'An unspecified error occured' });
		}
	});

//Static routes
app.use(express.static('bower_components'));
app.use(express.static('front_end'));

//Set routes
app.use('/', router);


//Server initialization
app.listen(80);