Template.viewPost.helpers({
	'post':function(){
		return Session.get("viewPost");
	},
});

Template.postAnswer.helpers({
	postOwner: function () {
		return Session.get("viewPost").data.userid;
	},
	isSolution:function(){
		return this.data.solution;
	},
});

Template.postAnswer.events({
	'click .js-remove-answer':function(event, template){
		Meteor.call("removeAnswer", Session.get("viewPost")._id, this._id, function(err, data){
	    	if(err){
	    		console.log(error);
	    	}else{
	    		
	    	}
	    });
	},
	'submit .js-comment-post':function(event, template){
		event.preventDefault();

		var comment = $(event.currentTarget[0]).val();
		var user = this.data.userid;
		var data ={
	      userid: Meteor.userId(),
	      post: Session.get("viewPost")._id,
	      answer: this._id,
	      solution: false,
	      categories: Session.get("viewPost").data.categories,
	      tags: Session.get("viewPost").data.tags,
	      comment: comment,
	      updated:  new Date().getTime(),
	      timestamp:  new Date().getTime(),
	    }


	    Meteor.call("addComment", data, user, function(err, data){
	    	if(err){
	    		console.log(error);
	    	}else{
	    		template.find("#comment-textarea").value = "";
	    	}
	    });
	},
	'click .js-up-vote-answer':function(event, template){
		Meteor.call("voteAnswer", "up", this._id, this.data.userid, function(err, data){
	    	if(err){
	    		console.log(error);
	    	}else{
	    		
	    	}
	    });
	},
	'click .js-down-vote-answer':function(event, template){
		Meteor.call("voteAnswer", "down", this._id, this.data.userid, function(err, data){
	    	if(err){
	    		console.log(error);
	    	}else{
	    		
	    	}
	    });
	},
	'click .js-set-solution':function(event, template){
		Meteor.call("solution", this._id, Session.get("viewPost")._id, function(err, data){
			if(err){
				console.log(err);
			}
		});
	}
});

Template.viewPost.events({
	'submit .js-form-comment':function(event, template){
		event.preventDefault();

		var comment = template.find("#input-comment").value;
		var user = Session.get("viewPost").data.userid;
		var data ={
	      userid: Meteor.userId(),
	      post: Session.get("viewPost")._id,
	      replies: [],
	      solution: false,
	      categories: Session.get("viewPost").data.categories,
	      tags: Session.get("viewPost").data.tags,
	      comment: comment,
	      updated:  new Date().getTime(),
	      timestamp:  new Date().getTime(),
	    }


	    Meteor.call("addComment", data, user, function(err, data){
	    	if(err){
	    		console.log(error);
	    	}else{
	    		template.find("#input-comment").value = "";
	    		$("#input-comment-label").removeClass("active");
	    		$("#input-comment").css("height", "3rem"); 	    	}
	    });
	},
	'submit .js-form-answer':function(event, template){
		event.preventDefault();

		var answer = Session.get("editor-text");
		if(answer != ""){
			var user = Session.get("viewPost").data.userid;
			var data ={
		      userid: Meteor.userId(),
		      post: Session.get("viewPost")._id,
		      comments: [],
		      answer: answer,
		      solution: false,
		      upvote: [],
		      downvote: [],
		      categories: Session.get("viewPost").data.categories,
		      tags: Session.get("viewPost").data.tags,
		      updated:  new Date().getTime(),
		      timestamp:  new Date().getTime(),
		    }


		    Meteor.call("addAnswer", data, user, function(err, data){
		    	if(err){
		    		console.log(error);
		    	}else{
		    		template.find(".js-editor").value = "";
		    		Session.set("editor-text", "");
		    	}
		    });
		}
	},
	'click .js-up-vote':function(event, template){
		Meteor.call("vote", "up", Session.get("viewPost")._id, Session.get("viewPost").data.userid, function(err, data){
	    	if(err){
	    		console.log(error);
	    	}else{
	    		
	    	}
	    });
	},
	'click .js-down-vote':function(event, template){
		Meteor.call("vote", "down", Session.get("viewPost")._id, Session.get("viewPost").data.userid, function(err, data){
	    	if(err){
	    		console.log(error);
	    	}else{
	    		
	    	}
	    });
	},
	'click .js-favorite':function(event, template){
		Meteor.call("favorite", Session.get("viewPost")._id, Session.get("viewPost").data.userid, function(err, data){
	    	if(err){
	    		console.log(error);
	    	}else{
	    		
	    	}
	    });
	},
});