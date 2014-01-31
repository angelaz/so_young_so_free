if (Meteor.isClient) {
  var increment = moment.duration(30, "minutes");

  Accounts.ui.config({
    requestPermissions: {
      google: ["https://www.googleapis.com/auth/calendar.readonly"]
    }
  });

  Session.set("timeStart", 8);
  Session.set("timeEnd", 19);

  var dateRange = function () {
    return _.map(_.range(7), function (index) {
      return moment().startOf("day").add("days", index);
    });
  };

  var indexToHourName = function (index) {
    if (index === 0) {
      return "12 am";
    } else if (index === 12) {
      return "12 pm";
    } else if (index < 12) {
      return index + " am";
    } else {
      return (index - 12) + " pm";
    }
  };

  Template.calendar.helpers({
    hours: function () {
      var timeRange = _.range(Session.get("timeStart"),
        Session.get("timeEnd"));
      return _.map(timeRange, function (index) {
        return {
          hourName: indexToHourName(index),
          hourIndex: index
        };
      });
    },
    dateRange: dateRange,
    moments: function (hourIndex) {
      return _.map(dateRange(), function (date) {
        return date.add("hours", hourIndex);
      });
    },
    dayName: function () {
      return this.format("ddd, MMM D");
    },
    timeslot: function () {

    }
  });

  Template.calendar.events({
    "mousedown .cell": function () {
      console.log(this);
    }
  });

  Template.body.events({
    "click .import": function () {
      Meteor.call("getGoogleCalendarList", function (error, result) {
        if (error) {
          alert("There was an error getting the list of your calendars.");
        } else if (result && result.data && result.data.items) {
          Session.set("calendarList", result.data.items);
        }
      });
    }
  });

  Template.calendarList.helpers({
    calendars: function () {
      return Session.get("calendarList");
    }
  });

  // go through all displayed calendars and fill in timeslots
  var timeslotify = function () {
    var rangeStartTime = dateRange()[0];
    var rangeEndTime = _.last(dateRange()).clone().endOf("day");

    var newTimeslots = {};

    // roundUp = true to round up to the time increment, otherwise
    // rounds down;
    var roundToIncrement = function (time, roundUp) {
      time.clone().startOf("hour");

    };

    var fillTimeSlots = function (startTime, endTime) {
      for (var i = rangeStartTime.clone();
        i.isSame(rangeEndTime);
        i.add("minutes", 30)) {
          newTimeslots[i] = true;
        }
    };

    _.each(Session.get("calendarList"), function (calendar) {
      if (Session.get("calendar-" + calendar.id)) {
        _.each(Session.get("calendar-" + calendar.id).items, function (event) {
          if (event.start && event.end) {
            var start = moment(event.start.dateTime || event.start.date);
            var end = moment(event.end.dateTime || event.end.date);

            if (start.isAfter(rangeEndTime) || end.isBefore(rangeStartTime)) {
              return;
            }

            console.log(rangeStartTime.calendar(), start.calendar(), end.calendar(), rangeEndTime.calendar());
          }
        });
      }
    });
  };

  var calendarInSession = function (googleCalendarId) {
    return Session.get("calendar-" + googleCalendarId);
  };

  var displayCalendar = function (googleCalendarId) {
    if (calendarInSession(googleCalendarId)) {
      Session.set("showCalendar-" + googleCalendarId, true);
      timeslotify();
    } else {
      Meteor.call("getGoogleCalendarEvents", googleCalendarId,
        function (error, result) {
          if (error) {
            alert("there was an error retrieving the calendar.");
          } else if (result) {
            Session.set("calendar-" + googleCalendarId, result.data);
            Session.set("showCalendar-" + googleCalendarId, true);
            timeslotify();
          }
        });
    }
  };

  Template.calendarList.events({
    "change input": function (event) {
      if (event.target.checked) {
        displayCalendar(this.id);
      } else {
        Session.set("showCalendar-" + this.id, false);
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.methods({
    getGoogleCalendarEvents: function (calendarId) {
      var auth = "Bearer " + Meteor.user().services.google.accessToken;
      var url = "https://www.googleapis.com/calendar/v3" +
        "/calendars/" + calendarId + "/events";

      this.unblock();
      var result = HTTP.get(url, {
        headers: {
          Authorization: auth
        },
        params: {
          timeMin: (new Date()).toISOString()
        }
      });

      return result;
    },
    getGoogleCalendarList: function () {
      var auth = "Bearer " + Meteor.user().services.google.accessToken;
      var url = "https://www.googleapis.com/calendar/v3" +
        "/users/me/calendarList";

      this.unblock();
      var result = HTTP.get(url, {
        headers: {
          Authorization: auth
        }
      });

      return result;
    }
  });
}