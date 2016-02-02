Messages = new Mongo.Collection(null)
const pusher = new Pusher()

sendMessage = function(taskId, text) {
  const task = {
    taskId,
    text,
    sent: new Date(),
    sender: Meteor.userId(),
    username: Meteor.user().username
  }

  Messages.insert(task)
  console.log(Pusher)
}
