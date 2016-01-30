Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Accounts.onLogin(function() {
  Tasks.find({assigned: Meteor.userId()}).observeChanges({
    added(id, fields) {
      if (!fields.received) Meteor.call('receivedTask', id)
    },
    changed(id, fields) {
      if (!fields.received) Meteor.call('receivedTask', id)
    }
  })
})

Meteor.subscribe("tasks")

Meteor.subscribe("userData")

Meteor.startup(function() {
  ReactDOM.render(<App />, document.getElementById('render-target'))
})
