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

    if (Meteor.isServer && Meteor.userId() !== userId) {
      const title = `${Meteor.user().username} has assigned you a task`
      Push.send({
        from: 'push',
        title,
        text: `${task.text}, ${new Date().toLocaleTimeString()}`,
        badge: 1,
        sound: 'airhorn.caf',
        payload: {
            title,
            text: task.text
        },
        query: { userId }
      })
    }
  },

  receivedTask(taskId) {
    const task = Tasks.findOne(taskId)

    if (task.assigned !== Meteor.userId())
      throw new Meteor.Error("not-authorized")

    Tasks.update(taskId, { $set: {received: true}})
  }
})
