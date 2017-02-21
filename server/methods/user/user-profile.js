Meteor.methods({
	//this section was developed in the first version of this project
	//no longer in use
	//user update profile
	userFirstNameChange:function(name){
		this.unblock();
		
		UserDetails.update({userid: Meteor.userId()}, {$set: { "fname": name }});
	},
	userLastNameChange:function(name){
		this.unblock();
		
		UserDetails.update({userid: Meteor.userId()}, {$set: { "lname": name }});
	},
});