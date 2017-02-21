Meteor.methods({
	//this section is called when the user accesses the website
	//a rank is generated everytime a user logges in
	//a rank is based on the amount of votes the user has for answers and posts + what comments the user has
	//We aggregate through posts and answers collection

	//------------------------------------ UNIPLIMENTED IDEAD ------------------------------------
	//unimplemented idea - we still want to improve this ranking as we would like to add:
	// - how many posts the user has created
	// - how many views in total the user has acquired in he's posts
	// - how many times the profile has been viewed
	// - how long the user has been a member
	// - how many connections(connections would later be implemented)
	//--------------------------------------------------------------------------------------------
	'userAccessRank':function(){
		this.unblock();

		var user = Meteor.userId();

		validateUser(user);

		//user aggregation command
		var userVotesCount = [
		  {$match: {"data.userid": user } },
		  {$group: {'_id': user,   up_votes: {$sum: {$size: '$data.upvote'} }, down_votes: {$sum: {$size: '$data.downvote'} } }},
		];

		//system wide aggregation command
		var systemVotesCount = [
		  {$group: {'_id': user,   up_votes: {$sum: {$size: '$data.upvote'} }, down_votes: {$sum: {$size: '$data.downvote'} } }},
		];
		
		//get total post and answer votes for user
		var postVotes = Posts.aggregate(userVotesCount);
		var answerVotes = Answers.aggregate(userVotesCount);

		//get total post and answer votes system wide
		var systemPostVotes = Posts.aggregate(systemVotesCount);
		var systemAnswerVotes = Answers.aggregate(systemVotesCount);

		try{
			//calculate up votes - down votes
			var user_votes = {
				answer: answerVotes[0].up_votes - answerVotes[0].down_votes,
				post: postVotes[0].up_votes - postVotes[0].down_votes, 
			};

			//total upvotes
			var system_votes = {
				answer: systemAnswerVotes[0].up_votes,
				post: systemPostVotes[0].up_votes, 
			};

			//calculate rank for user post
			var rankPost = ((user_votes.post / system_votes.post) * (user_votes.post)) / system_votes.post;
			//calculate rank for user answer
			var rankAnswer = ((user_votes.answer / system_votes.answer) * (user_votes.answer)) / system_votes.answer;

			//calculate user post rank + user answer rank
			var finalRank = rankPost + rankAnswer;

			//finally update user rank profile
			UserDetails.update({userid: user}, {
				$set:{
					updated: new Date().getTime(),
					rank: finalRank,
				}
			});
		}catch(e){
			//
		}

	},
	//tetsting - trying to get rank of all users
	'getAllRank':function(){

		var userVotesCount = [
		  {$group: {'_id': '$data.userid',   up_votes: {$sum: {$size: '$data.upvote'} }, down_votes: {$sum: {$size: '$data.downvote'} } }},
		];

		var systemVotesCount = [
		  {$group: {'_id': null,   up_votes: {$sum: {$size: '$data.upvote'} }, down_votes: {$sum: {$size: '$data.downvote'} } }},
		];
		
		var postVotes = Posts.aggregate(userVotesCount);
		var answerVotes = Answers.aggregate(userVotesCount);

		var systemPostVotes = Posts.aggregate(systemVotesCount);
		var systemAnswerVotes = Answers.aggregate(systemVotesCount);


		console.log(postVotes);
		console.log(answerVotes);

	},
	//testing aggregation
	testAggregate:function(){
		var pipelineSelections = [
            //Match documents in Companies collection where the 'ticker' value was selected by the user.//
            {$match: {"data.userid": Meteor.userId() }},
            {
                $group: {
                    _id: '$data.userid',
                    up_votes: {$sum: {$size: '$data.upvote'} },
                    down_votes: {$sum: {$size: '$data.downvote'} },
                    totalVote: {$subtract: [$up_votes, $down_votes]},
                    //more//
                }
            },
            {
                $project: {
                    _id: 0,
                    totalVote: 1,
                    //more//
                }
            }
        ];

        var results = Posts.aggregate(pipelineSelections);

        console.log(results);
    }
});