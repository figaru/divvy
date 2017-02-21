Meteor.methods({
	'PostSearchQuery':function(query){
		validateUser(Meteor.userId());

		if (!query) {
	      return Posts.find({}, {limit: 10});
	    }

	    var res = Posts.find(
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
	},

	//adding query search to search index collection
	//Later used in the FAQ
	'AddSearchIndex':function(data){
		validateUser(Meteor.userId());

		var index_exists = SearchIndex.findOne({"query.query": data.query}, {reactive: false});

		if(index_exists){
			var postMatch = {
				match: false,
				post: "",
			}

			index_exists.posts.forEach(function (post) {
				if(data.post === post.post){
					postMatch.match = true;
					postMatch.post = post;
				}
			});

			if(postMatch.match){
				SearchIndex.update({_id: index_exists._id, "posts.post": data.post}, {
					$inc: {"query.matched": +1, "posts.$.clicked": +1},
					$set: {updated: new Date().getTime()},
				});
			}else{
				SearchIndex.update({_id: index_exists._id}, {
					$inc: {"query.matched": +1},
					$push: {"posts": {post: data.post, clicked: 1}},
					$set: {updated: new Date().getTime()},
				});
			}

			
			//SearchIndex.update({_id: index_exists._id}, {""}, callback);
		}else{
			var obj = {
				query: {query: data.query, matched: 1},
				posts: [{post: data.post, clicked: 1}],
				timestamp: new Date().getTime(),
				updated: new Date().getTime(),
			}

		    SearchIndex.insert(obj);
		}
	},
	'getSearchIndex':function(){
		console.log(SearchIndex.find({}).fetch());
	}
});
//------------------------------------ UNIPLIMENTED IDEAD ------------------------------------
// Test 1
//	search ranking was done in C# to test or initial ranking concept
//--------------------------------------------------------------------------------------------
//------------------------------------ UNIPLIMENTED IDEAD ------------------------------------
// Test 2
//unimplemented idea - our testes ranking algorythm was to be implemented before the presentation
// failed due to time constraints
// test 2 was tested in client side
//--------------------------------------------------------------------------------------------

var getRanked = function(){
	var res = [];

	RankedSearch.remove({});

    var posts = PackageSearch.getData({});
    var query = Session.get("query");

    if(posts && query){
    	var querySplit = query.match(/\S+/g);

		posts.forEach(function(item){
			var title = item.title.match(/\S+/g);
			var description = item.description.match(/\S+/g);

			var totalWords = title.length + 1 + description.length + 1;
	        var queryLength = querySplit.length + 1;
	        var rankTitle = 0;
	        var rankDescription = 0;
	        var match = 0;
	        var conMatch = 0;

	        if(item.title == query){
	        	conMatch += queryLength;
	        }

			querySplit.forEach(function (queryWord) {
				title.forEach(function (word) {
					if (queryWord == word)
                    {
                        match++;
                    }
				});

				description.forEach(function (word) {
					if (queryWord == word)
                    {
                        match++;
                    }
				});
			});

			var rank = match + (conMatch * queryLength) / totalWords;

			console.log(rank);

			RankedSearch.insert({
				title: item.title,
				description: item.description,
				rank: rank,
				timestamp: item.timestamp,
			});

		});
    }

	return RankedSearch.find({}, {sort:{rank: -1}});
};

//------------------------------------ UNIPLIMENTED IDEAD ------------------------------------
// Test 3
//unimplemented idea - our testes ranking algorythm was to be implemented before the presentation
// failed due to time constraints
//--------------------------------------------------------------------------------------------
var ranking = function() {
	//testing input
	var searchterm = "hello world";
	var post1 = {userid:1,title:"IE nextSibling and hello nextElementSibling not working?",tags:["hello","world"],comments:[],views:3,upvote:[],downvote:[],favorites:[],
	solved:false,categories:"",description:"It's just a simple dropdown menu...works fine hello world in Chrome, FF and Safari. but in IE: Unable to get property 'style' of undefined or null reference",};
	var post2 = {userid:1,title:"Industry 4.0 hello world live data",tags:["world"],comments:[],views:2,upvote:[],downvote:[],favorites:[],
	solved:false,categories:"",description:"Iam looking for live data world provided by a machine in context of hello industry 4.0. The machine should be integrated into a production progress. I need the data of sensors e.g. position, pressure, temperature etc. Do you know companies that provide those data, or maybe a server that can be accessed via REST? The data will be used for machine learning (predictions etc.) Thanks for sharing your sources",};
	var post3 = {userid:1,title:"the world says hello",tags:[],comments:[],views:5,upvote:[],downvote:[],favorites:[],
	solved:false,categories:"",description:"in this thread all I want to say is hello",};
	var posts = [post1,post2,post3];
	
	//actual variables
	var res = [];
	var queryLength = searchterm.length;
	var searchSplit = searchterm.split(" ");
	
	posts.forEach(function(item){
	
		var titleSplit = item.title.split(" ");
		var descriptionSplit = item.description.split(" ");
		var titleLength = item.title.length;
		var descriptionLength = item.description.length;
		var titleCon = 0;
		var descriptionCon = 0;
		var titleMatch = 0;
		var descriptionMatch = 0;
		var tagMatch = 0;
		var viewMatch = item.views*0.0001;
		var voteMatch = (item.upvote.length - item.downvote.length)*0.001
		var favoriteMatch = item.favorites.length*0.002;
		//search tags for matches
		item.tags.forEach(function(tagWord){
			if (searchterm.indexOf(tagWord) != -1)
			{
				tagMatch+= 2;
			}
		});
		//search title for single Word matches
		titleSplit.forEach(function(titleWord){
			var tWord = cutEnd(titleWord);
			searchSplit.forEach(function(searchWord){
				var sWord = cutEnd(searchWord);
				if (tWord == sWord)
				{
					titleMatch++;
				}
			});
		});
		//search description for single Word matches
		descriptionSplit.forEach(function(descriptionWord){
			var dWord = cutEnd(descriptionWord);
			searchSplit.forEach(function(searchWord){
				var sWord = cutEnd(searchWord);
				if (dWord == sWord)
				{
					descriptionMatch++;
				}
			});
		});
		//search title for connected Word matches
		if (item.title.indexOf(searchterm) != -1)
		{
			titleCon+= 4;
		}
		//search description for connected Word matches
		if (item.description.indexOf(searchterm) != -1)
		{
			descriptionCon+= 1;
		}
		//calculate rank
		rank = ((favoriteMatch+voteMatch+viewMatch+tagMatch+titleMatch+descriptionMatch)/queryLength+(titleCon+descriptionCon)*queryLength)/(titleLength+descriptionLength);
		console.log(rank);
	});
};
	
var cutEnd = function(cutWord){
		if (cutWord.slice(-1) == "." || cutWord.slice(-1) == "?" || cutWord.slice(-1) == "!")
		{
			return cutWord.slice(0,-1);
		}
		return cutWord;
};

var getSearchRanking = function(posts, searchtags){
		var res = [];

        if(posts && searchtags){
        	posts.forEach(function(item){
				var totalTags = searchtags.length + 1;
		        var match = 0;
		        var conMatch = 0;

				searchtags.forEach(function (tagWord) {
					item.data.tags.forEach(function (tag) {
						if (tagWord == tag)
	                    {
	                        match++;
	                    }
					});
				});

				if(match == totalTags){
					conMatch += totalTags;
				}

				var rank = match + (conMatch * totalTags) / totalTags;

				res.push({post: item, rank: rank});
				//console.log(rank);
			});
        }

		return res;
};