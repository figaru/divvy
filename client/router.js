//routes file
//manage all routes


//subs manager - package that allows for subscription reuse - performance in mind
subs = new SubsManager({
    // maximum number of cache subscriptions
    cacheLimit: 25,
    // any subscription will be expire after 5 minute, if it's not subscribed again
    expireIn: 30
});

Router.configure({
  //main layout
  layoutTemplate: 'auth_layout',
  //loader layout
  loadingTemplate : 'loader',
  //error layout
  notFoundTemplate: '404',
  //on before any routing action
  //check if user logged in and limiting access to routes
  onBeforeAction: function(pause) {
      var path = Router.current().route._path; ;
      var login = path.indexOf("login") > -1; 
      var register = path.indexOf("signup") > -1;
      var about = path.indexOf("about") > -1;
      var guide = path.indexOf("guide") > -1;

      if (!Meteor.userId()) {
        if (login || register || about || guide){
          this.next();
        }else{
          this.redirect("/landing");
          this.next();
        }
      }else{
        //check if user logged in with service eg. facebook
        //if user has no userdetails create
        Meteor.call("addServiceUser", function(err, data){
          if(err){
            console.log(err);
          }
        });

        //update user rank if user logged in
        Meteor.call("userAccessRank", function(err, data){
          if(err){
            console.log(err);
          }else{
            console.log("Your rank as been updated!");
          }
        });

        this.next();
      }
  },
  subscriptions: function() {
    //subscribing to mongo collections
    //this allows access to the actual db and its tables/documents
    return [
          subs.subscribe("all-posts"),
          subs.subscribe("all-comments"),
          subs.subscribe('all-tags'),
          subs.subscribe('all-categories'),
          subs.subscribe('all-users'),
          subs.subscribe('all-answers'),
          subs.subscribe('all-chats'),
          subs.subscribe('all-messages'),
          subs.subscribe('userStatus'),
          subs.subscribe('user-notifications', Meteor.userId()),
      ] 
  },
  data: function(){
    //set user details in session
    Session.set('user', UserDetails.findOne({userid: Meteor.userId()}) );
    //set notifications in session
    Session.set('notifications', Notifications.find({}).fetch() );
  }
});


Router.route('/', {
  //fastRender: true,
  action:function(){
    if(this.ready()){
      this.render('headerBanner', {to: 'banner'});
      this.render('home',{
        data: function(){
          /*Session.set('user', UserDetails.findOne({userid: Meteor.userId()}));*/
          Session.set("homePosts", {
              related: Posts.find({}, { sort:{"data.solved": -1,"data.views": -1, "data.timestamp": -1}, limit:8}).fetch(),
              trending: Posts.find({}, { sort:{"data.timestamp": -1, "data.views": -1}, limit:8}).fetch(),
              popular: Posts.find({}, { sort:{"data.views": -1, "data.timestamp": -1}, limit:8}).fetch(),
          });
        }
      });
    }else{
      this.render('loader');
    }
  }
});

Router.route('/landing', {
  //fastRender: true,
  action:function(){
    this.layout('layout');
    this.render('landing');
  }
});

Router.route('/about', {
  //fastRender: true,
  action:function(){
    this.layout('layout');
    this.render('about');
  }
});

Router.route('/howto', {
  //fastRender: true,
  action:function(){
    this.layout('auth_layout_full');
    this.render('howto');
  }
});

Router.route('/knowledge', {
  //fastRender: true,
  action:function(){
    this.layout('auth_layout_full');
    this.render('knowledge');
  }
});

Router.route('/faq', {
  //fastRender: true,
  action:function(){
    this.layout('auth_layout_full');
    this.render('faq');
  }
});


Router.route('/login', {
  //fastRender: true,
  action:function(){
    this.layout('auth');
    this.render('loginPage');
  }
});

Router.route('/initial', {
  //fastRender: true,
  action:function(){
    this.layout('auth');
    this.render('initial');
  }
});


Router.route('/signup', {
  //fastRender: true,
  action:function(){
    this.layout('auth');
    this.render('register');
  }
});


Router.route('/test', {
  //fastRender: true,
  action:function(){
    this.render('textEditor');
  }
});