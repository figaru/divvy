

Session.setDefault('chat-search-focus', false);

Template.userChat.helpers({
	getChats:function(){
		return Session.get("userChats");
	},
	selectedChat:function(){
		if(Session.get("selectedChat")){
			return true;
		}else{
			return false;
		}
	},
	getReceiver:function(involved){
		var user1 = involved[0];
		var user2 = involved[1];

		if(user1 != Meteor.userId()){

			return user1;  
		}else{

			return user2;  
		}

	},
	getLastMessage:function(chatid){
		if(chatid){
			var messages = Chats.findOne({_id: chatid}).messages;

			var message = messages[messages.length-1];

			var res = Messages.findOne({_id: message});

			return res.message;
		}else{
			return "";
		}
	},
	getMessages:function(){
		if(Session.get("selectedChat")){
			$(".user-chat-right-col").animate({ scrollTop: $('.user-chat-right-col').prop("scrollHeight") *2 + 300}, 500);
			$(".chat-ul").animate({ scrollTop: $('.chat-ul').prop("scrollHeight") *2 + 300}, 500);
			var array = [];
			var messages = Chats.findOne({_id: Session.get("selectedChat")._id}).messages;

			messages = messages.slice(Math.max(messages.length - 20, 0));

			messages.forEach(function(message){
				var getMessage = Messages.findOne({_id: message});	
				if(getMessage != undefined)
					array.push(getMessage);
			});
			return array;
		}else{
			return[];
		}
	},
	'messageOrder':function(params){
		if(params){
			if(params.sender == Meteor.userId()){
				return false;
			}
			else{
				return true;
			}
		}
		else{
			return false;
		}
	},
	'searchFocus':function(){
		return Session.get("chat-search-focus");
	}
});

Template.userChat.events({
	'keydown .js-chat-message-input':function(event, template){
		if (event.which == 13 || event.keyCode == 13) {
	        //code to execute here
	        var textarea = template.find(event.currentTarget);

	        if(event.shiftKey){
	        	textarea.value += "\n";
	        	//console.log(event);
	        }else{
	        	if(textarea.value != ""){
			    	send(textarea);
			    }
	        }
	    }
	},
	'click .js-send-button':function(event, template){
	    var textarea = template.find(event.currentTarget);

	    if(textarea.value != ""){
	    	send(textarea);
	    }
	},
	'click .js-user-chat':function(event, template){
		Session.set("selectedChat", this);
	},
	'click .js-user-chat-search-toggle':function(event, template){
		Session.set('chat-search-focus', true);
	},
	'click .js-user-chat-search-close':function(event, template){
		Session.set('chat-search-focus', false);
	},
	'keyup .js-chat-search-input': _.throttle(function(e) {
    	var text = $(e.target).val().trim();

    	Meteor.call('searchChat', text, function (error, result) {
    		if(error){

    		}else{
    			Session.set("chatSearchResults", result);
    		}
    	});
    	
  	}, 200)
});

var send = function(textarea){
	Meteor.call("newMessage", Session.get("selectedChat")._id, Meteor.userId(), Session.get("selectedChat").involved[1], textarea.value, function(err){
		if(err){
			console.log(err)
		}else{
			textarea.value = "";
		}
	});
}

Template.chatSearchResults.helpers({
	getResult: function() {
	    return Session.get("chatSearchResults");
	}, 
	isLoading: function() {
		return false;
	}
});

Template.chatSearchResults.events({
	'click .js-search-result-chat-item':function(event, template){
		Meteor.call("newChat", this.userid, function(err){
			if(err){
				console.log(err);
			}else{
				Session.set('chat-search-focus', false);
				Session.set("selectedChat", undefined);
			}
		});
	}
});
