
Template.postItem.events({
	'click .js-post':function(event, template){
		Meteor.call("addViewPost", this._id);
	},
});