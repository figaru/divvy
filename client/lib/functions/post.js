Template.registerHelper("getDateDiffObject", function (time) {
	if(!time)
		return "unknown";

	var date = Date.diff(new Date().getTime(), time);
	return date; 
});

Template.registerHelper("getPostTitle", function (id) {
	if(id){
		return Posts.findOne({_id: id}).data.title;
	}else{
		return "";
	}
});

Template.registerHelper("getPostCategory", function (id) {
	if(id){
		var catid = Posts.findOne({_id: id}).data.categories[0];

		return Categories.findOne({_id: catid}).color;
	}else{
		return "";
	}
});



Template.registerHelper("getComments", function (ids) {
	if(!ids)
		return [];

	var postComments = new Mongo.Collection(null);
	
	ids.forEach(function(item){
		try{
			postComments.insert( Comments.findOne({_id: item}) );
		}catch(err){
			console.log(err);
		}
	});

	return postComments.find({}, {sort: {"data.updated": -1}, limit: 5}).fetch();
});


Template.registerHelper('voteCount', function(data){
	if(data){
		var count = data.upvote.length - data.downvote.length;
		var color;

		if(count == 0){color = "#ccc"}
			else if(count >= 1){color = "#01a185"}
			else if(count < 0){color = "#c33825"}

		var res = {
			vote: count,
			color: color,
		}

		return res;
	}else{
		var res = {
			vote: 0,
			color: "#ccc",
		}
		return res;
	}
});



Template.registerHelper('getFavorites', function(fav){
	if(fav.length <= 0){
		return '<i class="material-icons js-favorite">star_rate</i><span>0</span>';
	}else{
		return '<i class="material-icons js-favorite" style="color: #f3c500">star_rate</i><span style="color: #f3c500">'+fav.length+'</span>';
	}
});


Template.registerHelper("getAnswers", function (ids) {
	if(!ids)
		return [];

	var postAnswers = new Mongo.Collection(null);
	var res = [];
	
	ids.forEach(function(item){
		try{
			var obj = Answers.findOne({_id: item});

			obj.data.counts = {
				votes: obj.data.upvote.length - obj.data.downvote.length,
				comments: obj.data.comments.length,
			}

			postAnswers.insert(obj);
		}catch(err){
			console.log(err);
		}
	});

	return postAnswers.find({}, {sort: {"data.counts.votes": -1, "data.counts.comments": -1} }).fetch();
});


Template.registerHelper("getDateDiff", function (time) {
	if(!time)
		return "unknown";
	
	var date = Date.diff(new Date().getTime(), time);
	if(date.days <= 0){
		if(date.hours <= 0){
			if(date.minutes <= 0){
				if(date.seconds <= 1)
					return date.seconds + " second ago";

				return date.seconds + " seconds ago";
			}else{
				if(date.minutes <= 1)
					return date.minutes + " minute ago";

				return date.minutes + " minutes ago";
			}
		}else{
			if(date.hours <= 1)
				return date.hours + " hour ago";

			return date.hours + " hours ago"
		}
	}else{
		if(date.days <= 1)
			return date.days + " day ago";

		return date.days + " days ago";
	}
});