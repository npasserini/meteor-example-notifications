Meteor.publish("userData", function () {
  return Meteor.users.find({}, {username: '1'})
});

Meteor.startup(function () {
  Meteor.publish("tasks", function() {
    return Tasks.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    })
  })
});
