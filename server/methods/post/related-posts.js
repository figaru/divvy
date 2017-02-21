Meteor.methods({
	'related':function(tags){
		var posts = Posts.find({"data.tags": {$in: tags} }).fetch();

		var res = getRelatedRanking(posts, tags);
		//console.log(res);
		return res;
	},
	//get related posts to user using tags
	//------------------------------------ UNIPLIMENTED IDEAD ------------------------------------
	//unimplemented idea - One brilliant idea we discussed would be to actually get related posts 
	//according to what the user as posted previously, then by cat and tags
	//--------------------------------------------------------------------------------------------
	'getRelatedUser':function(tagids){

		var tags = [];

		tagids.forEach(function (id) {
			console.log(id);
			tags.push(Tags.findOne({_id: id}).name);
		});

		var posts = Posts.find({"data.tags": {$in: tags} }).fetch();

		var res = getRelatedRanking(posts, tags);

		//console.log(res);

		return res;
	},
});

//simple get related rating algorythm using tags
//------------------------------------ UNIPLIMENTED IDEAD ------------------------------------
//unimplemented idea - wanted to add a more concrete related algorythm
// where not only tags would be matched but title, content, comments and answers would be compared
// answers can be used at multiple posts
//--------------------------------------------------------------------------------------------
var getRelatedRanking = function(posts, searchtags){
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
}