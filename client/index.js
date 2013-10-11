Template.calendar.format_date = function(date, options) {
    return moment(date).format(options.format);
};

Template.calendar.days = function () {
  return [
    {
      date: moment(),
      free_times: [
        {name: "first event"},
        {name: "second event"}
      ]
    }
  ];
};

var calendarList = function() {
    Meteor.call('getCalendarList', function(err, response) {
        Session.set('serverCalendarListResponse', response);
        if (response['data'] != null && response['data']['item'] != null) { 
            var calendarListResponse = response['data']['items'];
            var calendars = calendarListResponse.map(function(item) {
                return {
                    summary: item.summary,
                    id: item.id
                };
            })
            Session.set('calendarList', calendars);
        }
    });
};

calendarList();

Template.index_loggedin.calendars = function () {
    return Session.get('calendarList');
};


Template.index_loggedin.freetime = function () {
    var timespan = 7

    
};










//////// AUTHENTICATION

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
