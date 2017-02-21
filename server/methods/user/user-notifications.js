Meteor.methods({
	//clear user notifications
	clearNotifications:function(){
		this.unblock();
		var user = Meteor.userId();

		validateUser(user);

		UserDetails.update({userid: user}, { $set : {'notifications': [] }});
		Notifications.remove({owner: user});
	},
});