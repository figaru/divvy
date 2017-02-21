Template.postCreationValidation.helpers({
	'getRelation':function(){
		var res;

		Meteor.call("postCreationValidation", Session.get("post-creation-title"), function(err, data){
			if(err){
				console.log(err);
			}else{
				if(data.length <= 0){
					Router.go("/post/create/" + Session.get("post-creation-title"));
				}else{
					Session.set("post-creation-title-relation", data);
				}
			}
		});

		return Session.get("post-creation-title-relation");
	}
});

Template.postCreationValidation.events({
	'click .js-validation-continue':function(event, template){
		Router.go("/post/create/" + Session.get("post-creation-title"));
	},
});