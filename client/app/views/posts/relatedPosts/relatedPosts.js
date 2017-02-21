RelatedPosts = new Mongo.Collection(null);

Template.relatedPosts.helpers({
  getResult: function() {
  	RelatedPosts.remove({});

	Meteor.call("related", Session.get("viewPost").data.tags, function(err, data){
		if(err){
			console.log(err);
		}else{
			data.forEach(function (post) {
				RelatedPosts.insert(post);
			});
		}
	});

    return RelatedPosts.find({"post._id": { $ne: Session.get("viewPost")._id} }, {sort:{rank: -1}});
  }, 
  isLoading: function() {
    return RelatedPostSearch.getStatus().loading;
  }
});


Template.relatedPosts.events({
	'click .js-related-post-item':function(event, template){
		Router.go("/post/view/" + this.post._id);
	}
});