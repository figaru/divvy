Posts = new Mongo.Collection("posts");
UserDetails = new Mongo.Collection("user-details");
Tags = new Mongo.Collection("tags");
Categories = new Mongo.Collection("categories");
Comments = new Mongo.Collection("comments");
Answers = new Mongo.Collection("answers");
Notifications = new Mongo.Collection('notifications');

//Search index - Is used to show quick results of previously searched similar queries + choosing FAQ's
//3 columns: 
//_id: "",
// query: {query: "", matched: $inc},
//  posts: {post: postid, clicked: $inc},
// 		timestamp: new Date().getTime(),
SearchIndex = new Mongo.Collection("search-index");

//Chat system collections
Chats = new Mongo.Collection("chats");
Messages = new Mongo.Collection("messages");


if(Meteor.isServer) {
	//ensuring index for faster search query
 	Posts._ensureIndex({"data.title": "text", "data.tags": 1});
 	UserDetails._ensureIndex({"fname": "text", "lname": 1});

}