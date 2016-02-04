Messages = new Mongo.Collection(null)

sendMessage = function(taskId, conversationId, text) {
  addMessage(taskId, text, Meteor.user().username)

  layer.send(JSON.stringify({
    type: 'request',
    body: {
      request_id: text,
      method: 'Message.create',
      object_id: conversationId,
      data: { parts: [{
        mime_type: 'text/plain',
        body: text
      }]}
    }
  }))
}

addMessage = function(taskId, text, username) {
  const message = {
    taskId,
    text,
    username
  }

  console.log("Message received: ", message)

  Messages.insert(message)
}
