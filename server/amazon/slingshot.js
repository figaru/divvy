//restrict what kind of file can be uploaded
// in this case just images/profile
/*Slingshot.fileRestrictions( "uploadToAmazonS3", {
  allowedFileTypes: [ "image/png", "image/jpeg", "image/gif" ],
  maxSize: 1 * 1024 * 1024
});

//create directory in amazon storage if not exist
Slingshot.createDirective( "uploadToAmazonS3", Slingshot.S3Storage, {
  bucket: "opzio-files",
  acl: "public-read",
  authorize: function () {
    let userFileCount = Files.find( { "userId": this.userId } ).count();
    return userFileCount < 3 ? true : false;
  },
  key: function ( file ) {
    var user = Meteor.users.findOne( this.userId );
    return  "projects/testproject/" + file.name;
  }
});*/