Meteor.methods({
	//check if user has profile or user details
	checkInitial:function(){
		if(!UserDetails.findOne({userid: Meteor.userId()})){
			return true;
		}else{
			return false;
		}
	},
	//Initial form if user has no profile
	initialForm:function(data){	
		
		validateUser(Meteor.userId());

		tags = [];

		data.skills.forEach(function (tag) {
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

		data.skills = tags;

		if(!UserDetails.findOne({userid: data.userid}))
			UserDetails.insert(data);
	},
	//update user profile
	updateProfile:function(data){	
		
		validateUser(Meteor.userId());

		tags = [];

		data.skills.forEach(function (tag) {
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

		data.skills = tags;

		UserDetails.update({userid: data.userid}, data);
	}
});