Tracker.autorun(function () {
  var current = Router.current();
  Tracker.afterFlush(function () {
  	Meteor.setTimeout(function(){
  		$(".layout-test").scrollTop(0);
  	}, 200);
  });
});