Template.userDetailsPosts.helpers({
	userPosts: function () {
		if(Session.get("userProfile")){
			return Posts.find({"data.userid": Session.get("userProfile").userid}).fetch();
		}else{
			return [];
		}
	}
});