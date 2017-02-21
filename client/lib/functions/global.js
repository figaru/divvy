Template.registerHelper("isOwner",function(compareid){
	if(compareid == Meteor.userId()){
		return true;
	}else{
		return false;
	}
});


Template.registerHelper("countArray", function (array) {
	if(array){
		return array.length;
	}else{
		return 0;
	}
	 
});

Template.registerHelper("emptyArray", function (array) {
	if(array.length <= 0){
		return true;
	}else{
		return false;
	}
	 
});

Template.registerHelper("countVoteArray", function (vote) {
	if(vote){
		return vote.upvote.length + vote.downvote.length;
	}else{
		return 0;
	}
	 
});



Template.registerHelper("timeToDate", function (timestamp) {
	if(!timestamp)
		return "unknown";

	var d = new Date(timestamp), // Convert the passed timestamp to milliseconds add *1000 if wrong value
    yyyy = d.getFullYear(),
    mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
    dd = ('0' + d.getDate()).slice(-2),     // Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ('0' + d.getMinutes()).slice(-2),   // Add leading 0.
    ampm = 'AM',
    time;
      
	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}

	// ie: 2013-02-18, 8:35 AM  
	time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

	return time;
});