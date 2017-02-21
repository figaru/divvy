Meteor.methods({
	//create a post
	createPost:function(data){	
		
		validateUser(Meteor.userId());

		//check if tag
		//check if tag already exists in tags collections
		//create if does not exist
		//finally return ids for each tag - so it can be linked to posts
		tags = [];
		data.tags.forEach(function (tag) {
			tag.trim();
			if(!tag){
				//do nothing
			}else{
				var tagid = Tags.findOne({name: tag});
				if(!tagid){
					tags.push(Tags.insert({
						name: tag,
						creator: Meteor.userId(),
						timestamp: new Date().getTime(),
					}));
				}else{
					tags.push(tagid._id);
				}
			}
		});

		data.tags = tags;

		//insert post
		Posts.insert({data});
	},
	//vote on post
	vote:function(type, postid, postowner){
		//this.unblock - the client does not need to wait for response from server
		this.unblock();

		var user = Meteor.userId();
		validateUser(user);

		//votes post
		//check if user already voted up vote or vice versa
		//if vote already contains(up or down) in another remove the current vote + add new vote to new selection(up or down)
		//notify owner of the post
		if(type == "up"){
			if(!Posts.findOne({_id: postid,"data.upvote": user})){
				if(Posts.findOne({_id: postid, "data.downvote": user})){
					Posts.update({_id: postid}, { $pull: {"data.downvote": user} });
					Posts.update({_id: postid}, { $push: {"data.upvote": user} });
					notify(3, postowner, postid, user);
				}else{
					Posts.update({_id: postid}, { $push: {"data.upvote": user} });

					notify(3, postowner, postid, user);
				}	
			}
		}else if(type == "down"){
			if(!Posts.findOne({_id: postid, "data.downvote": user})){
				if(Posts.findOne({_id: postid, "data.upvote": user})){
					Posts.update({_id: postid}, { $pull: {"data.upvote": user} });
					Posts.update({_id: postid}, { $push: {"data.downvote": user} });
					notify(4, postowner, postid, user);
				}else{
					Posts.update({_id: postid}, { $push: {"data.downvote": user} });
					notify(4, postowner, postid, user);
				}
			}
		}
	},
	//vote on an answer of post
	voteAnswer:function(type, answerid, owner){
		//this.unblock - the client does not need to wait for response from server
		this.unblock();

		var user = Meteor.userId();
		validateUser(user);

		//votes Answer
		//check if user already voted up vote or vice versa
		//if vote already contains(up or down) in another remove the current vote + add new vote to new selection(up or down)
		//notify owner of the answer
		if(type == "up"){
			if(!Answers.findOne({_id: answerid,"data.upvote": user})){
				if(Answers.findOne({_id: answerid, "data.downvote": user})){
					Answers.update({_id: answerid}, { $pull: {"data.downvote": user} });
					Answers.update({_id: answerid}, { $push: {"data.upvote": user} });
					notify(6, owner, answerid, user);
				}else{
					Answers.update({_id: answerid}, { $push: {"data.upvote": user} });

					notify(6, owner, answerid, user);
				}	
			}
		}else if(type == "down"){
			if(!Answers.findOne({_id: answerid, "data.downvote": user})){
				if(Answers.findOne({_id: answerid, "data.upvote": user})){
					Answers.update({_id: answerid}, { $pull: {"data.upvote": user} });
					Answers.update({_id: answerid}, { $push: {"data.downvote": user} });
					notify(7, owner, answerid, user);
				}else{
					Answers.update({_id: answerid}, { $push: {"data.downvote": user} });
					notify(7, owner, answerid, user);
				}
			}
		}
	},
	//Post owner assigns answer as solution
	//solution answers later used in knowledge center
	solution:function(answerid, postid){
		//this.unblock - the client does not need to wait for response from server
		this.unblock();

		var user = Meteor.userId();
		validateUser(user);

		//set answer as solution
		Answers.update({_id: answerid}, {
			$set: {"data.solution": true},
		}, function(err){
			if(err)
				console.log(err);
		});

		//update post stating that it contains a solution
		Posts.update({_id: postid}, {
			$set: {solved: true},
		},function(err){
			if(err)
				console.log(err);
		});


	},
	//let user set a post as favorite
	favorite:function(postid, postowner){
		//this.unblock - the client does not need to wait for response from server
		this.unblock();

		var user = Meteor.userId();
		validateUser(user);

		//set array of favorites with user id
		//------------------------------------ UNIPLIMENTED IDEAD ------------------------------------
		//idea - aggregate through all posts to find out what are the users favorite posts
		//--------------------------------------------------------------------------------------------
		if(!Posts.findOne({_id: postid, "data.favorites": user})){
			Posts.update({_id: postid}, { $push: {"data.favorites": user} });

			notify(2, postowner, postid, user);
		}else{
			Posts.update({_id: postid}, { $pull: {"data.favorites": user} });
		}

	},
	//add view to post
	addViewPost:function(postid){
		//this.unblock - the client does not need to wait for response from server
		this.unblock();

		var user = Meteor.userId();
		validateUser(user);

		/*if(!Posts.findOne({_id: postid, "data.views": user}) ){
			Posts.update({_id: postid},{ $inc: {"data.views": +1} });
		}
		*/
		//simple add view
		//initially it was based on user ids but we also want the views to increase multiple times per user

		//------------------------------------ UNIPLIMENTED IDEAD ------------------------------------
		//unimplemented idea - and history field would be added to track what user has viewed
		//--------------------------------------------------------------------------------------------
		Posts.update({_id: postid},{ $inc: {"data.views": +1} });

	},
	//add comment to answer
	addComment:function(data, owner){
		//this.unblock - the client does not need to wait for response from server
		this.unblock();

		validateUser(Meteor.userId());

		var comment = Comments.insert({data});

		Answers.update({_id: data.answer},{ $push: { "data.comments": comment }});

		//notify - answer comment
		notify(1, owner, data.post, Meteor.userId());

	},
	//add answer to post
	addAnswer:function(data, postowner){
		//this.unblock - the client does not need to wait for response from server
		this.unblock();

		validateUser(Meteor.userId());

		//add answer to answers collection + get id
		var answer = Answers.insert({data});

		//use answer id to update post answers array
		Posts.update({_id: data.post},{ $push: { "data.answers": answer }});

		//notify - answer created
		notify(5, owner, answerid, Meteor.userId());

	},
	removeAnswer:function(postid, answerid){
		//this.unblock - the client does not need to wait for response from server
		this.unblock();

		//remove answer - Testing
		Posts.update({_id: postid}, { $pull: {"data.answers": answerid} });
		Answers.remove({_id: answerid});
		Comments.remove({"data.answer": answerid});
	},
	updatePost:function(postid, description){
		//this.unblock - the client does not need to wait for response from server
		this.unblock();
		
		var user = Meteor.userId();
		validateUser(user);

		if(Posts.findOne({_id: postid, "data.userid": user}))
		{
			Posts.update({_id: postid}, { $set: {"data.description": description} });
		}
	},
	//before creating the post check if similar post exists
	//return to user to decie if helpful
	//------------------------------------ UNIPLIMENTED IDEA ------------------------------------
	//unimplemented idea - wanted to add a better comparison algorythm - similar to search
	//--------------------------------------------------------------------------------------------
	postCreationValidation:function(searchValue){
		validateUser(Meteor.userId());

		if (!searchValue) {
	      return Posts.find({});
	    }

	    var res = Posts.find(
	      { $text: {$search: searchValue} },
	      {
	        fields: {
	          score: { $meta: "textScore" }
	        },
	        sort: {
	          score: { $meta: "textScore" }
	        }
	      }
	    ).fetch();

	    return res;
	},

	test: function(){
		console.log(Meteor.userId());
		return this;
	}
});


//create a notification
var notify = function(type, owner, postid, creator){
	//1 = comment
	//2 = favorited
	//3 = post upvote
	//4 = post downvote
	//5 = answer creation
	//6 = answer up vote
	//7 = answer down vote
	var notificationid;
	if(type == 6 || type == 7 || type == 5){
		notificationid = Notifications.insert({
			type: type,
			owner: owner,
			answer: postid,
			creator: creator,
			timestamp: new Date().getTime(),
		});
	}else{
		notificationid = Notifications.insert({
			type: type,
			owner: owner,
			post: postid,
			creator: creator,
			timestamp: new Date().getTime(),
		});
	}

	UserDetails.update({userid: owner},{ $push: {"notifications": notificationid} });
}