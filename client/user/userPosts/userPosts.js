Template.userPosts.helpers({
	'userPosts':function(){
		return	Session.get("userPosts");
	},
	'selectedPost':function(){
		return Session.get("selected-post");
	}
});

Template.userPosts.events({
	'click .js-user-post-tab':function(event, template){
		$(".user-post-tab").removeClass("user-post-tab-checked");
		$("#user-post-tab-" + this._id).addClass("user-post-tab-checked");

		Session.set("selected-post", this);
	},
	'click .js-user-post-tab':function(event, template){
		$(".user-post-tab").removeClass("user-post-tab-checked");
		$("#user-post-tab-" + this._id).addClass("user-post-tab-checked");

		Session.set("selected-post", this);
	},
	'submit .js-user-post-details-submit':function(event, template){
		event.preventDefault();

		var text = template.find(".js-user-post-textarea").value;
    	if(text == this.data.description){
    		return;
    	}else{
    		Meteor.call("updatePost", this._id, text, function(err){
    			if(err){
    				console.log(err);
    			}else{

    			}
    		});
    	}
	},
	'keyup .js-user-post-textarea': _.throttle(function(e) {
    	var text = $(e.target).val().trim();
    	if(text == Session.get("selected-post").data.description){
    		
    	}
  	}, 200)
});