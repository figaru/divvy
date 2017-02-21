Router.route('/user/details/:userid', function () {
    this.render('userProfile', {
    	data:function(){
            Session.set("userProfile", {
                details: UserDetails.findOne({userid: this.params.userid}),
                posts: Posts.find({"data.userid": this.params.userid }).fetch(),
                comments: Comments.find({"data.userid": this.params.userid}).fetch(),
                answers: Answers.find({"data.userid": this.params.userid}).fetch(),
                votes:{
                    upvote: Posts.find({"data.upvote": this.params.userid}).fetch(),
                    downvote: Posts.find({"data.downvote": this.params.userid}).fetch(),
                },
            });
    	}
    });
});

Router.route('/user/profile', function () {
    this.render('userProfile', {
        data:function(){
            var user = Meteor.userId();
            Session.set("userProfile", {
                details: UserDetails.findOne({userid: user}),
                posts: Posts.find({"data.userid": user }).fetch(),
                comments: Comments.find({"data.userid": user}).fetch(),
                answers: Answers.find({"data.userid": user}).fetch(),
                votes:{
                    upvote: Posts.find({"data.upvote": user}).fetch(),
                    downvote: Posts.find({"data.downvote": user}).fetch(),
                },
            });
        }
    });
});

Router.route('/user/posts', function () {
    this.render('userPosts', {
    	data:function(){
    		Session.set("userPosts", Posts.find({"data.userid": Meteor.userId() }).fetch() );
    	}
    });
});

Router.route('/user/edit', function () {
    this.layout('auth');
    this.render('initial', {
        data:function(){
            Session.set("userProfile", UserDetails.findOne({userid: Meteor.userId() }));
        }
    });
});

Router.route('/user/chat', function () {
    this.layout('auth_layout_full');
    this.render('userChat', {
        data:function(){
            Session.set("userChats", Chats.find({involved: Meteor.userId()}).fetch());
        }
    });
});
