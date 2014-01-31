var Events = new Meteor.Collection("events");

if (Meteor.isClient) {
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
    }
  });

  var addToCalendar = function (startTime, endTime) {
    Events.insert({
      startTime: startTime,
      endTime: endTime
    });
  };

  Template.calendar.events({
    "mousedown .cell": function () {
      console.log(this);
    }
  });
}