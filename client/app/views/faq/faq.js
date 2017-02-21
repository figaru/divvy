faqQuestions = new Mongo.Collection(null);
faqPosts = new Mongo.Collection(null);

Template.faq.rendered = function () {
	Meteor.call("FAQ", function(err, data){
		if(err){
			console.log(err);
		}else{
			console.log(data);
			faqQuestions.remove({});
			faqPosts.remove({});

			data.forEach(function (index) {
				var id = faqQuestions.insert({
					index: index.indexid,
					question: index.query, 
				});

				index.posts.forEach(function (post) {
					faqPosts.insert({
						question: id,
						post: post,
					});
				});
			});
		}
	});
};

Template.faq.helpers({
	'FAQ':function(){

		return faqQuestions.find({}).fetch();
	},
	'FAQpost':function(){
		return faqPosts.findOne({question: this._id}, {reactive: false}).post;
	},
});