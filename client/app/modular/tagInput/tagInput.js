Template.tagInput.helpers({
  'listTags':function(){
    return Session.get("tags");
  }
});

Template.tagInput.events({
  'keyup .js-input-post-tags':function(event, template){
    if (event.keyCode == 13) {
      if(event.currentTarget.value != ""){
        var tags = Session.get("tags");

        tags.push(event.currentTarget.value);

        Session.set("tags", tags);

        event.currentTarget.value = "";
      }
    }
  },
  'click .js-tag-remove':function(event, template){
    var tags = Session.get("tags");

    var index = tags.indexOf(this.toString());
    if (index > -1) {
        tags.splice(index, 1);
    }

    Session.set("tags", tags);
  }
});