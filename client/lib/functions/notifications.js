Template.registerHelper("getNotification", function (data) {
	

	//type 6 = answer upvoted
	//type 7 = answe downvoted

	if(data.type == 1){
		var post = Posts.findOne({_id: data.post});
		var res = {
			context: "Comment",
			icon: '<i class="material-icons">add_circle</i>',
			event: "Added new comment to your post: <b>" + post.data.title + "<b>",
		}

		return res;
	}else if(data.type == 2){
		var post = Posts.findOne({_id: data.post});
		var res = {
			context: "Favorite",
			icon: '<i class="material-icons">star</i>',
			event: "Favorited your post: <b>" + post.data.title + "<b>",
		}
		return res;
	}else if(data.type == 3){
		var post = Posts.findOne({_id: data.post});
		var res = {
			context: "Up Vote",
			icon: '<i class="material-icons">arrow_drop_up</i>',
			event: "Up voted your post: <b>" + post.data.title + "<b>",
		}
		return res;
	}else if(data.type == 4){
		var post = Posts.findOne({_id: data.post});
		var res = {
			context: "Down Vote",
			icon: '<i class="material-icons">arrow_drop_down</i>',
			event: "Down voted your post: <b>" + post.data.title + "<b>",
		}
		return res;
	}else if(data.type == 5){
		var post = Posts.findOne({_id: data.post});
		var res = {
			context: "New Answer",
			icon: '<i class="material-icons">question_answer</i>',
			event: "New Answer added to your post: <b>" + post.data.title + "<b>",
		}
		return res;
	}else if(data.type == 6){
		//answer upvoted
		var answer = Answers.findOne({_id: data.answer});
		var post = Posts.findOne({_id: answer.data.post});
		var res = {
			context: "Answer Up voted",
			icon: '<i class="material-icons">arrow_drop_up</i>',
			event: "Up voted your Answer in the post: <b>" + post.data.title + "<b>",
		}
		return res;
	}else if(data.type == 7){
		//answer downvote
		var answer = Answers.findOne({_id: data.answer});
		var post = Posts.findOne({_id: answer.data.post});
		var res = {
			context: "Answer Down voted",
			icon: '<i class="material-icons">arrow_drop_down</i>',
			event: "Down voted your Answer in the post: <b>" + post.data.title + "<b>",
		}
		return res;
	}else{
		return {};
	}
});