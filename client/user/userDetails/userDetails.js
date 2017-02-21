Template.userDetails.helpers({
	user: function () {
		return Session.get("userProfile");
	}
});

Template.userDetails.events({
	'click .js-chat-start':function(event, template){
		Meteor.call("newChat", Session.get("userProfile").userid, function(err){
			if(err){
				console.log(err);
			}
		});
	}
});