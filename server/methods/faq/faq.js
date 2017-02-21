Meteor.methods({
	//first testing faq questions
	'getFAQ':function(){
		//get top 10 queries that have a post linked to them 
		var index  = SearchIndex.find({}, {sort: {"query.matched": -1, updated: -1}, limit: 10} ).fetch();

		var res =[]

		//loop through each index retrieved
		index.forEach(function (index) {
			var posts = [];

			//get posts for each index
			index.posts.forEach(function (post) {
				var result = Answers.findOne({"data.post": post.post});
				
				if(result){
					posts.push(post);
				}		
			});

			//confirm that there is a post
			//create object to send to client - contains the question and the post linked to question
			if(posts.length > 0){
				res.push({
					indexid: index._id,
					query: index.query.query,
					posts: posts,
				});
			}
		});

		return res;
	},
	FAQ:function(){
		//get top 10 queries that have a post linked to them 
		var index  = SearchIndex.find({}, {sort: {"query.matched": -1, updated: -1} }, {limit: 10} ).fetch();

		var res =[];

		//loop through index
		index.forEach(function (index) {

			var posts = [];
			//loop through each post contained in the query
			index.posts.forEach(function (post) {

				//aggregate through all documents in the answers collection that correspond to the post
				//retriving up/down votes and number of comments
				//sort by most votes
				//return top answer only
				var answerCount = [
				  {$match: {"data.post": post.post} },
				  {$project: { num_up_votes: {$size: '$data.upvote'}, num_down_votes: {$size: '$data.downvote'}, num_comments: {$size: '$data.comments'} }},
				  {$sort: {num_up_votes: -1, num_down_votes: 1, num_comments: -1, "data.updated": -1, } },
				  {$limit: 1}
				];
				var answer = Answers.aggregate(answerCount);	

				//check if post contains any answer
				if(answer.length > 0){

					//create response object for specific question and add to array
					posts.push({
						post: Posts.findOne({_id: post.post}),
						answer: Answers.findOne({_id: answer[0]._id}),
					});
				}

			});

			//finally check if question contains post with answer
			if(posts.length > 0){
				//push to res array data
				res.push({
					indexid: index._id,
					query: index.query.query,
					posts: posts,
				});
			}
		});

		return res;
		
	},
	getHighestAnswer:function(postid){//testing - calculating highest answer
		//db.posts.aggregate([{$project: {num_votes: {$size: '$data.upvote'} }}, {$sort: {num_votes: -1} }]);
		var voteCount = [
		  {$match: {"data.post": postid} },
		  {$project: { num_up_votes: {$size: '$data.upvote'}, num_down_votes: {$size: '$data.downvote'}, num_comments: {$size: '$data.comments'} }},
		  {$sort: {num_up_votes: -1, num_down_votes: 1, num_comments: -1, "data.updated": -1, } },
		  {$limit: 1}
		];

		var result = Answers.aggregate(voteCount);

		return Answers.findOne({_id: result._id});
	},
});
