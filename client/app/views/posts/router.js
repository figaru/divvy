Router.route('/post/create', {
  action: function(){
    if(this.ready()){
      this.render('createPostCheck',{
        data: function(){
          Session.set('tags', []);
        }
      });
    }else{
      this.render('loader');
    }
  },
});

Router.route('/post/create/validate/:title', {
  action: function(){
    if(this.ready()){
      this.render('postCreationValidation',{
        data: function(){
          Session.set('post-creation-title', this.params.title);
        }
      });
    }else{
      this.render('loader');
    }
  },
});

Router.route('/post/create/:title', {
  action: function(){
    if(this.ready()){
      this.render('createPost',{
        data: function(){
          var data = {
            title: this.params.title,
            description: "",
            tags: "",
            categories: "",
          }
          Session.set('post-creation', data);
        }
      });
    }else{
      this.render('loader');
    }
  },
});

Router.route('/post/view/:postid', {
  //fastRender: true,
  action: function(){
    if(this.ready()){
      this.render('viewPost',{
        data: function(){
          Session.set('viewPost', Posts.findOne({_id: this.params.postid}));
        }
      });
      this.render('relatedPosts', {to: 'related'});
    }else{
      this.render('loader');
    }
  },
});