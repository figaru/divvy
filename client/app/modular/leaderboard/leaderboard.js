Template.leaderboard.helpers({
	'leader':function(){
		var array = [];
		
		array = UserDetails.find({}, 
		{ 
			sort:{
				rank: -1,
			} 
		},
		{
			limit: 5
		}
		).fetch();

	    return array;
	},
});


Template.leaderUser.helpers({
	'index':function(){
		return i++;
	},
});