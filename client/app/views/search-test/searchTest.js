Session.setDefault("Search-Results", []);
Session.setDefault("Search-Query", "");
Session.setDefault("Search-Searching", false);

Template.searchTest.helpers({
	'getResults':function(){
		var res;

		//Session.set("Search-Searching", false);
		return Session.get("Search-Results");
	},
	'searching':function(){
		return Session.get("Search-Searching");
	}
});


Template.searchTest.events({
	'click .js-search-close':function(event, template){
		$('.layout-test').removeClass('layout-test-searching');
		$('.search').removeClass('css-toggled');
	},
	'click .js-search-item':function(event, template){
		var data = {
			query: Session.get("Search-Query"),
			post: this._id,
		}

		if(data.query != ""){
			Meteor.call("AddSearchIndex", data, function(err, data){
				if(err){
					console.log(data);
				}else{
					console.log("query indexed");
				}
			});
		}

		Router.go("/post/view/" + this._id);

		$('.layout-test').removeClass('layout-test-searching');
		$('.search').removeClass('css-toggled');
	},
	'keyup .js-search': _.throttle(function(e) {
    	var text = $(e.target).val().trim();
    	
    	if(text && text != ""){
    		Session.set("Search-Query", text);
    		Meteor.call("PostSearchQuery", text, function(err, data){
				if(err){
					console.log(err);
					//Session.set("Search-Searching", false);
				}else{
					//Session.set("Search-Searching", false);
					Session.set("Search-Results", data);
				}
			});
    	}

  	}, 1000)
});


		/*var data = {
			query: "this is a test",
			post: "47xa9Y8EwXozkgpRN"
		}*/