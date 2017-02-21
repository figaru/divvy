//android development route

//android app login and register

Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
    extended: false
}));

Router.onBeforeAction(Iron.Router.bodyParser.json({
	limit: "100mb"
}));

Router.route(
	'/app/login', 
	function () {
        var response = {};
        var res = this.response;
		var req = this.request;

		try {
		    if (ApiPassword.validate({email: req.body.email, password: req.body.password})) {
		      	//console.log('password is valid for this user');
		      	var user = Meteor.users.findOne({ "emails.address" : req.body.email });
		      	response = {
			        error: false,
				    uid: user._id,
				    user: {
				        name: user.profile.name,
			        	email: req.body.email,
			        	created_at: new Date().getTime(),
			        	updated_at: new Date().getTime(),
			        },
			    };
		    } else {
		      	response = {
				    tag: "login",
				    success: 0,
				    error: 1,
				    error_msg: "Login credentials are incorrect. Please try again!"
				}
		    }
		} catch (exc) {
		  		//console.log(exc.message);
		  		response = {
				    tag: "login",
				    success: 0,
				    error: 1,
				    error_msg: "User account does not exist."
				}
		  // 'User is not found', 'User has no password set', etc
		}

		var final = JSON.stringify(response);


		//Right now we always send 200 OK code.
		res.end(final);

	}, 
	{
		where: 'server'
	}
);

Router.route(
	'/app/register', 
	function () {
        var response = {};
        var res = this.response;
		var req = this.request;

		try {
		    if (!Meteor.users.findOne({ "emails.address" : req.body.email })) {
		      	//console.log('password is valid for this user');
		      	var options = {
			      email: req.body.email,
			      password: req.body.password,
			      profile: {
			          name: req.body.name,
			          admin: true
			    }};

			    var user = Accounts.createUser(options);

			    console.log(user);

			    response = {
				    error: false,
				    uid: user,
				    user: {
				        name: req.body.name,
				        email: req.body.email,
				        created_at: new Date().getTime(),
				        updated_at: null
				    }
				}
		      	
		    } else {
		      	response = {
				    success: 0,
				    error: 2,
				    error_msg: "User already existed with " + req.body.email,
				}
		    }
		} catch (exc) {
		  	response = {
			    error: 1,
			    error_msg: "Unknown error occurred in registration!"
			}
		  // 'User is not found', 'User has no password set', etc
		}

		var final = JSON.stringify(response);

		//Right now we always send 200 OK code.
		res.end(final);

	}, 
	{
		where: 'server'
	}
);
