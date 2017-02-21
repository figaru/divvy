let template;

let _getFileFromInput = ( event ) => event.target.files[0];

let _setPlaceholderText = ( string = "Click or Drag a File Here to Upload" ) => {
  template.find( ".alert span" ).innerText = string;
};

let _uploadFileToAmazon = ( file ) => {
  const uploader = new Slingshot.Upload( "uploadToAmazonS3" );

  uploader.send( file, ( error, url ) => {
    if ( error ) {
      console.log(error);
      _setPlaceholderText();
    } else {
      _addUrlToDatabase( url );
    }
  });
};

let _addUrlToDatabase = ( url ) => {
  Meteor.call( "storeUrlInDatabase", url, ( error ) => {
    if ( error ) {
      console.log(error);
      _setPlaceholderText();
    } else {
      console.log( "File uploaded to Amazon S3!", "success" );
      _setPlaceholderText();
    }
  });
};


let upload = ( options ) => {
  template = options.template;
  let file = _getFileFromInput( options.event );

  _setPlaceholderText( `Uploading ${file.name}...` );
  _uploadFileToAmazon( file );
};

Modules.client.uploadToAmazonS3 = upload;