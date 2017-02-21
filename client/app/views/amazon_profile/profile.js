Template.profile.helpers({
	images: function () {
    return Images.find(); // Where Images is an FS.Collection instance
  },
  loading: function(){
  	return Session.get("loading");
  }
});

Template.profile.events({
  'change .myFileInput': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      var imagesid = Images.insert(file, function (err, fileObj) {
        if(err){
          console.log(err)
        }
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      });
      console.log(imagesid._id);
    });
  }
 });

Template.uploader.events({
  'change input[type="file"]' ( event, template ) {
    Modules.client.uploadToAmazonS3( { event: event, template: template } );
  }
});

Template.files.onCreated( () => Template.instance().subscribe( 'files' ) );

Template.files.helpers({
  files() {
    var files = Files.find( {}, { sort: { "added": -1 } } );
    if ( files ) {
      return files;
    }
  }
});

Template.file.helpers({
  isImage( url ) {
    const formats = [ 'jpg', 'jpeg', 'png', 'gif' ];
    return _.find( formats, ( format ) => url.indexOf( format ) > -1 );
  }
});