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

    HTTP.post('https://api.layer.com/nonces', { headers: {
      "Accept": "application/vnd.layer+json; version=1.0",
      "Content-Type": "application/json"
    }}, (error, result) => {
      Meteor.call('getLayerIdentityToken', (error, result) => {
        console.log('Done!', error, result)
      })
    })
  }
})
