Meteor.startup(function() {

    Future = Npm.require('fibers/future');

    Meteor.methods({
        getCalendarList: function() {
            this.unblock();

            var future = new Future();

            Meteor.http.get(Meteor.settings.public.google_calendar_api_url 
                + Meteor.settings.public.google_calendar_api_key, 
                {
                    headers: {
                      "Authorization": "Bearer " + Meteor.user().services.google.accessToken
                    }
                }, 
                function(error, result) {
                    future.return(result);
                }
            );

            return future.wait();
        }
    });
});