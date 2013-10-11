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
    }
});


Meteor.call('getCalendarList', function(err, response) {
    Session.set('serverCalendarListResponse', response);
    var calendarListResponse = response['data']['items'];

    var calendars = calendarListResponse.map(function(item) {
        return {
            summary: item.summary,
            id: item.id
        };
    })
    console.log(calendars);

    Session.set('calendarList', calendars);
});

Template.index_loggedin.calendars = function () {
    return Session.get('calendarList');
};