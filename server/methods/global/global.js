Meteor.methods({//get document count from some collections
	'getPostCount':function(){
		return Posts.find().count();
	},
	'getAnswerCount':function(){
		return Answers.find().count();
	},
	'getCommentsCount':function(){
		return Comments.find().count();
	},
	'getUsersCount':function(){
		return Users.find().count();
	},

});