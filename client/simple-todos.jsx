Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Meteor.subscribe("tasks")

Meteor.startup(function() {
  ReactDOM.render(<App />, document.getElementById('render-target'))
})
