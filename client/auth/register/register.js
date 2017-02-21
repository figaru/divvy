Template.register.helpers({
	'listCategories':function(event, template){
		return Categories.find({}).fetch();
	}
});

Template.register.events({
	'submit #register-form':function(event, template){
		event.preventDefault();

		var fname = template.find("#input-fname").value;
		var lname = template.find("#input-lname").value;
		var email = template.find("#input-email").value;
		var profile = template.find("#input-profile").value;
		var categories = _.map(template.findAll( "input[type=checkbox]:checked"), function(item) {
			return item.defaultValue;
		});
		var skills = Session.get("tags");
		var description = template.find("#input-description").value;

		var data ={
			userid: "",
			fname: fname,
			lname: lname,
			profile: profile,
			categories: categories,
			skills: skills,
			email: email,
			notifications: [],
			description: description,
			updated:  new Date().getTime(),
		}

		var create = {
			email: email,
			pass: template.find("#input-password").value,
		}

		if(template.find("#input-password").value == template.find("#input-confirm").value){
			Meteor.call("signup", data, create, function(err, data){
				if(err){
					$('.js-error').html(err.reason); 
				}else{
					return Router.go('/');
				}
			});
		}

	},
});