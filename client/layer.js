createConversation = function(taskId) {
  const participants = Meteor.users.find().map(user => user._id)

  layer.send(JSON.stringify({
    type: 'request',
    body: {
      request_id: taskId,
      method: 'Conversation.create',
      data: { participants, distinct: false, }
    }
  }))
}
