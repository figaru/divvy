Template.howto.events({
	'click .js-li':function(event, template){
		var position = $("#id"+event.target.id).position().top;
		$(".howto-content").scrollTop(position);
	},
});