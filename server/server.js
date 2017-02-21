Meteor.startup(function(){
    // code to run on server at startup
    console.log("---------------Server startup----------------");
    
    //check if categories exist
    init();
});


//publishing allows us to chose what collections and what data we want the
//user to have access too.
Meteor.publish("all-posts", function () {
	return Posts.find({}); // everything
});

Meteor.publish("all-tags", function () {
	return Tags.find({}); // everything
});

Meteor.publish("all-comments", function () {
	return Comments.find({}); // everything
});

Meteor.publish("all-categories", function () {
	return Categories.find({}); // everything
});

Meteor.publish("all-users", function () {
	return UserDetails.find({}); // everything
});

Meteor.publish("all-answers", function () {
	return Answers.find({}); // everything
});

Meteor.publish("all-chats", function () {
	return Chats.find({}); // everything
});

Meteor.publish("all-messages", function () {
	return Messages.find({}); // everything
});

Meteor.publish("user-notifications", function () {
	return Notifications.find({owner: this.userId}, {sort:{timestamp: -1}}); // everything from user
});

Meteor.publish("one-user", function (userid) {
	return UserDetails.find({userid: userid});
});

Meteor.publish("userStatus", function() {
  return Meteor.users.find({}, {fields:{status: 1}});
});


//testing methods
Meteor.methods({
	'getUser':function(){
		return Meteor.users.findOne({_id: Meteor.userId() });
	},
	addCat:function(){
		var names = [{name: "Design", code: "De", color: "#7e8c8d"},
			{name: "Production", code: "Po", color: "#00be9c"},
			{name: "Sales", code: "Sa", color: "#2c97df"},
			{name: "Marketing", code: "Ma", color: "#9c56b8"},
			{name: "Administration", code: "Ad", color: "#2c3e52"},
			{name: "Logistics", code: "Lo", color: "#d55400"},
			{name: "Information Technology", code: "It", color: "#c33825"}]

		_.each(names, function(cat) { 
			Categories.insert(cat);
		});
	},
});

//initialize
//check if categories exist
var init = function(){
	if(Categories.find().count() <= 0){
		var names = [{name: "Design", code: "De", color: "#7e8c8d"},
			{name: "Production", code: "Po", color: "#00be9c"},
			{name: "Sales", code: "Sa", color: "#2c97df"},
			{name: "Marketing", code: "Ma", color: "#9c56b8"},
			{name: "Administration", code: "Ad", color: "#2c3e52"},
			{name: "Logistics", code: "Lo", color: "#d55400"},
			{name: "Information Technology", code: "It", color: "#c33825"}]

		_.each(names, function(cat) { 
			Categories.insert(cat);
		});
	}
}