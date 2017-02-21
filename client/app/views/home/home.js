
Template.home.helpers({
	'getPosts':function(){
		return Session.get("homePosts");
	},
	'getRelated':function(){
		var tags = Session.get("user").skills;

		Meteor.call("getRelatedUser", tags, function(err, data){
			if(err){

			}else{

				Session.set("related-user-posts", data);
			}
		});

		console.log(Session.get("related-user-posts"));

		return Session.get("related-user-posts");
	},
	'hasPosts':function(){
		if(Session.get("homePosts")){
			return true;
		}else{
			return false;
		}
	},
});