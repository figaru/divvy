//check if there is a user
checkUser = function(userId){
	//Check if user
	if(!userId)
		throw new Meteor.Error("not-logged-in", "Denied: You are not logged in.");

	return true;
}

//check if user id exists
validateUser = function(userId){
	//Check if user
	if(!userId && typeof(Meteor.users.findOne({_id: userId})) == undefined)
		throw new Meteor.Error("not-logged-in", "Denied: You are not logged in.");

	return true;
}

//validate if user is admin
validateAdmin = function(userId){
	//Check if user is admin
	var admin = Meteor.users.findOne({_id: userId}).profile.admin;
	if(!admin)
       	throw new Meteor.Error("not-admin", "Denied: You do not have permission to continue.");

    return true;
}