Template.registerHelper("getTags", function (tags) {
	var res = [];
	
	if(tags){
		tags.forEach(function(item){
			res.push(Tags.findOne({_id: item}));
		});
	}
	return res;
});

Template.registerHelper("getTag", function (id) {
	return Tags.findOne({_id: id[0]});
});

var getTags = function (ids) {
	var res = [];
	
	ids.forEach(function(item){
		try{
			res.push(Tags.findOne({_id: item}));
		}catch(err){
			console.log(err);
		}
	});

	console.log(res);
	return res;
};