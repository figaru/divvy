Template.initial.helpers({
	'listCategories':function(event, template){
		return Categories.find({}).fetch();
	},
	'user':function(){
		return Session.get("userProfile");
	},
	'isCat':function(cat){
		if(cat == Session.get("userProfile").categories[0]){
			return true;
		}else{
			return false;
		}
	}
});

Template.initial.events({
	'submit #initial-form':function(event, template){
		event.preventDefault();

		var fname = template.find("#input-fname").value;
		var lname = template.find("#input-lname").value;
		var profile = template.find("#input-profile").value;
		var categories = _.map(template.findAll( "input[type=checkbox]:checked"), function(item) {
			return item.defaultValue;
		});
		var skills = Session.get("tags");
		var description = template.find("#input-description").value;

		var data ={
			userid: Meteor.userId(),
			fname: fname,
			lname: lname,
			profile: profile,
			categories: categories,
			skills: skills,
			notifications: [],
			description: description,
			updated:  new Date().getTime(),
		}


		Meteor.call("updateProfile", data, function(err, data){
			if(err){
				console.log(err);
			}else{
				return Router.go('/');
			}
		});

	},
});