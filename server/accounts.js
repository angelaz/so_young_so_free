Accounts.onCreateUser(function (options, user) {
  var accessToken = user.services.google.accessToken,
      result,
      profile;

  result = Meteor.http.get("https://www.google.com/calendar/feeds/default/owncalendars/full", {
        headers: {"User-Agent": "Meteor/1.0"},

    params: {
      access_token: accessToken
    }
  });

  if (result.error)
    throw result.error;

  profile = result.data;
  console.log(profile);

  // user.profile = profile;

  return user;
});