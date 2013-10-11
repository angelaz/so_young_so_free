Template.user_loggedout.events({
    "click #login": function(e, tmpl){
        Meteor.loginWithGoogle({
            requestPermissions: ['https://www.googleapis.com/auth/calendar']
        }, function (err) {
            if(err) {
                //error handling
            } else {
                //show an alert
                //alert('logged in');
            }
        });
    }
});

Template.user_loggedin.events({
    "click #logout": function(e, tmpl) {
        Meteor.logout(function(err) {
            if(err) {
                //sow err message
            } else {
                //show alert that says logged out
                //alert('logged out');
            }
        });
    },

    "click #getCalendar": function(e, tmpl) {
        Meteor.http.get("https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=100&key=AIzaSyBOK3i-5TR1Yg9IxxadJJedXdQW-CwvY70", {
            headers: {
              "Authorization": 'ya29.AHES6ZSHC2hguOO64Ho78L7rxCOce48-fY7y0mtLv_GTMg'
            },
            params: {
              access_token: 'ya29.AHES6ZSHC2hguOO64Ho78L7rxCOce48-fY7y0mtLv_GTMg'
            }
        }, function(error, result) {
            alert(console);
            window.console.log(result);
        });
    }
});
