Accounts.onCreateUser(function (options, user) {

  result = Meteor.http.get("https://www.google.com/calendar/feeds/default/owncalendars/full", {
        headers: {
          "User-Agent": "Meteor/1.0",
          "Authorization": user.services.google.accessToken
        },

    params: {
      access_token: user.services.google.accessToken
    }
  });

  if (result.error)
    throw result.error;

  profile = result.data;
  console.log(result);

  // user.profile = profile;

  return user;
});