Meteor.methods({
	//everytime user accesses the page add new timestamp to updated - later used / laste seen
	userAccess:function(){
		//this.unblock - the client does not need to wait for response from server
		this.unblock();


		UserDetails.update({userid: Meteor.userId()}, { $set:{updated: new Date().getTime()} });
	},
	//logging out user
	logoutUser:function(){
		Meteor.users.update({_id: Meteor.userId()}, {$set: { "services.resume.loginTokens" : [] }});
	},
	//if user logs in with service eg. facebook
	//if service loggin does not contain userDetails - create
	addServiceUser:function(){
		validateUser(Meteor.userId());

		if(!UserDetails.findOne({userid: Meteor.userId()}) ){
			var user = Meteor.user();
			var data ={
				userid: user._id,
				fname: user.services.facebook.first_name,
				lname: user.services.facebook.last_name,
				email: user.services.facebook.email,
				profile: "",
				categories: [],
				skills: [],
				notifications: [],
				description: "",
				timestamp:  new Date().getTime(),
				updated:  new Date().getTime(),
			}

			UserDetails.insert(data);
		}

		return;
	},
	//registering a new user
	signup:function(data, create){
		var user = {
		      email: create.email,
		      password: create.pass,
		      profile: {
		          name: data.fname + data.lname,
		          admin: false
		      }};

		data.userid = Accounts.createUser(user);

		tags = [];

		data.skills.forEach(function (tag) {
			tag.trim();
			if(!tag){
				//do nothing
			}else{
				var tagid = Tags.findOne({name: tag});
				if(!tagid){
					tags.push(Tags.insert({
						name: tag,
						creator: Meteor.userId(),
						timestamp: new Date().getTime(),
					}));
				}else{
					tags.push(tagid._id);
				}
			}
		});

		data.skills = tags;

		if(data.userid){
			UserDetails.insert(data);
		}

		return "User created!";

	},
});