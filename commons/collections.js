Tasks = new Mongo.Collection("tasks");

Meteor.methods({
  addTask(text) {
    if(!Meteor.userId()) {
      throw new Meteor.Error("not-authorized")
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    })
  },

  removeTask(taskId) {
    const task = Tasks.findOne(taskId)

    if(task.private && task.owner !== Meteor.userId())
      throw new Meteor.Error("not-authorized")

    Tasks.remove(taskId)
  },

  setChecked(taskId, checked) {
    const task = Tasks.findOne(taskId)

    if(task.private && task.owner !== Meteor.userId())
      throw new Meteor.Error("not-authorized")

    Tasks.update(taskId, {$set: {checked}})
  },

  setPrivate(taskId, private) {
    const task = Tasks.findOne(taskId)

    if (task.owner !== Meteor.userId())
      throw new Meteor.Error("not-authorized")

    Tasks.update(taskId, { $set: {private}})

  },

  assignTask(taskId, userId) {
    const task = Tasks.findOne(taskId)

    if (task.owner !== Meteor.userId())
      throw new Meteor.Error("not-authorized")

    Tasks.update(taskId, { $set: {assigned: userId, received: false}})
  },

  receivedTask(taskId) {
    console.log(taskId)
    const task = Tasks.findOne(taskId)

    if (task.assigned !== Meteor.userId())
      throw new Meteor.Error("not-authorized")

    Tasks.update(taskId, { $set: {received: true}})
  }
})
