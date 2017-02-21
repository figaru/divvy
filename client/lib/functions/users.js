Template.registerHelper("getUserName", function (userid) {
	var user = UserDetails.findOne({userid: userid});

	return user.fname+" " + user.lname;
});

Template.registerHelper("getUserRank", function (userid) {
	var user = UserDetails.findOne({userid: userid});

	return user.fname+" " + user.lname;
});

Template.registerHelper("getUserFName", function (userid) {
	var user = UserDetails.findOne({userid: userid});

	return user.fname;
});

Template.registerHelper("getUserStatus", function (userid) {
	var status = Meteor.users.findOne({_id: userid}).status;

	if(status.online == true){
		return "Online";
	}else{
		return "Offline";
	} 
});

Template.registerHelper("getUserImage", function (userid) {
	var res = UserDetails.findOne({userid: userid}, { fields: { 'profile': 1} }).profile;

	return res; 
});


Template.registerHelper("getOwnerImage", function () {
	var res = UserDetails.findOne({userid: Meteor.userId()}).profile;

	return res;
});


Template.registerHelper("getUserDetails", function (userid) {
	if(!userid){
		return {};
	}else{
		return UserDetails.findOne({userid: userid});
	}
});

Template.registerHelper("userCategories", function(categories){
	var res = [];
		
	if(categories){
		categories.forEach(function(item){
			res.push(Categories.findOne({_id: item}));
		});
	}

	return res;
});