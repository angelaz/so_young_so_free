Meteor.startup(function() {

    var Future = Npm.require('fibers/future');

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
        },

        getFreeTime: function(timespan, calendars) {

            console.log('getFreeTime called');
            this.unblock();

            var future = new Future();
            var events = null;

            for (var i = 0; i < calendars.length; i++) {
                calendar_id = calendars[i].id;
                console.log(calendar_id);
                console.log(calendar_id.replace("@", "%40"));

                Meteor.http.get("https://www.googleapis.com/calendar/v3/calendars/"
                    + calendar_id.replace("@", "%40")
                    + "/events?maxResults=1000"
                    + "&singleEvents=true&timeMax=" 
                    + "2013-10-18T00%3A00%3A00%2B00%3A00&"
                    + "timeMin=2013-10-01T00%3A00%3A00%2B00%3A00"
                    + "&key=" 
                    + Meteor.settings.public.google_calendar_api_key,
                    { headers: { "Authorization": "Bearer " + Meteor.user().services.google.accessToken}
                    }, 
                    function(error, result) {
                        events = result['data']['items'].map(function(item) {
                            return {
                                summary: item.summary,
                                id: item.id,
                                start: item.start.dateTime,
                                end: item.end.dateTime
                            };
                        });
                        future.return(events); //how do i make it return events in all calendars
                    }
                );
            }
            return future.wait();

        }
    });
});