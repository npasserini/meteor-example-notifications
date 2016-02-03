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

    let headers =  {
      "Accept": "application/vnd.layer+json; version=1.0",
      "Content-Type": "application/json"
    }

    HTTP.post('https://api.layer.com/nonces', { headers }, (error, result) => {
      const nonce = JSON.parse(result.content).nonce
      Meteor.call('getLayerIdentityToken', nonce, (error, identity_token) => {
        const data = {
          identity_token,
          app_id: 'layer:///apps/staging/552a481c-c9ca-11e5-ac55-80e4720f6b18'
        }

        HTTP.post('https://api.layer.com/sessions', { headers, data }, (error, result) => {
          const links = parseLinkHeader(result.headers.link)
          const websocketUrl = links.websocket.url .replace('https:', 'wss:')
          const session_token = JSON.parse(result.content).session_token

          client = new layer.Client({
            appId: 'layer:///apps/staging/552a481c-c9ca-11e5-ac55-80e4720f6b18',
            userId: Meteor.userId(),
            sessionToken: session_token
          });

          console.log(client)
        })
      })
    })
  }
})
