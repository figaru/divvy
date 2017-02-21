Meteor.methods({
	//send message
	'newMessage':function(chatid, sender, receiver, message){

		validateUser(Meteor.userId());

		var message = Messages.insert({
			message: message,
			sender: sender,
			receiver: receiver,
			timestamp:  new Date().getTime()
		});

		//check if chat exists
		if(Chats.findOne({_id: chatid})){
			Chats.update({_id: chatid}, {$push: { 
	      		messages: message
	      	}, $set:{
	      		status: "sent",
	      		updated: new Date().getTime()
	      	}});
		}else{
			throw new Meteor.Error("no-client-chat", "Failed: Could not match message to chat.");
		}
	},
	//creating a new chat between two users
	'newChat':function(userid){

		validateUser(Meteor.userId());

		if(Chats.findOne({involved: userid, involved: Meteor.userId()}) ){
			console.log("chat already exists");
		}else{
			Chats.insert({
				involved: [Meteor.userId(), userid],
				status: "sent",
				messages: [],
				updated: new Date().getTime(),
				timestamp:  new Date().getTime()
			});
		}
	},
	//search for a user to start a new chat
	searchChat:function(query){
		validateUser(Meteor.userId());

		if (!query) {
	      return UserDetails.find({}, {limit: 10});
	    }

	    var res = UserDetails.find(
	      { $text : {$search: query} },
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
	}
});