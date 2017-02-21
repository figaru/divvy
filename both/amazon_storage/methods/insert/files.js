Meteor.methods({
  storeUrlInDatabase: function( url ) {
    var stringurl = " " + url;
    Modules.both.checkUrlValidity(stringurl);

    try {
      Files.insert({
        url: url,
        userId: Meteor.userId(),
        added: new Date() 
      });
    } catch( exception ) {
      return exception;
    }
  }
});