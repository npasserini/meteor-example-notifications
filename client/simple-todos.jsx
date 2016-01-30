Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Meteor.subscribe("tasks")

Meteor.subscribe("userData")

Meteor.startup(function() {
  ReactDOM.render(<App />, document.getElementById('render-target'))
})

Tracker.autorun(function() {
  if (Meteor.userId()) {
    Tasks.find({assigned: Meteor.userId()}).observeChanges({
      added(id, fields) {
        if (!fields.received) Meteor.call('receivedTask', id)
      },
      changed(id, fields) {
        if (!fields.received) Meteor.call('receivedTask', id)
      }
    })
  }
})
