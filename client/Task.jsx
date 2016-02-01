Task = React.createClass({
  mixins: [ReactMeteorData],

  proptypes: {
    task: React.PropTypes.object.isRequired,
    showPrivateButton: React.PropTypes.bool.isRequired
  },

  getMeteorData() {
    return {
      users: Meteor.users.find().fetch(),
      messages: Messages.find({taskId: this.props.task._id}).fetch()
    }
  },

  getInitialState() {
    return { showMessages: false }
  },

  toggleChecked() {
    const {_id, checked} = this.props.task
    Meteor.call("setChecked", _id, !checked)
  },

  deleteThisTask() {
    Meteor.call("removeTask", this.props.task._id)
  },

  togglePrivate() {
    const {_id, private} = this.props.task
    Meteor.call("setPrivate", _id, !private)
  },

  toggleShowMessages() {
    const { showMessages } = this.state
    this.setState({showMessages: !showMessages})
  },

  sendMessage(event) {
    event.preventDefault()
    if (this.state.text) {
      sendMessage(this.props.task._id, this.state.text)
      this.setState({text:''})
    }
  },

  assignTask(event) {
    const taskId = this.props.task._id
    const userId = event.target.value
    Meteor.call("assignTask", taskId, userId)
  },

  render() {
    const { _id, checked, private, username, owner, text, assigned, received } = this.props.task,
      className = (checked ? 'checked' : '') + ' ' + (private ? 'private' : ''),
      mine = owner === this.props.currentUserId

    return (
      <li className={className}>
        <button className='delete' onClick={this.deleteThisTask}>&times;</button>
        <input
          id={_id}
          type='checkbox'
          readOnly={true}
          checked={checked}
          onClick={this.toggleChecked}
        />

        { mine &&
          <button className='toggle-private' onClick={this.togglePrivate}>
            {this.props.task.private ? "Private" : "Public"}
          </button>
        }
        <span className='text' onClick={this.toggleShowMessages}>
          <strong>{username}</strong>: {text}
        </span>
        <div className='assignee'>
          <span>Assigned to: </span>
          { mine ?
            <select onChange={this.assignTask} value={assigned}>
              {this.data.users.map(({_id, username}) =>
              <option key={_id} value={_id}> {username} </option>
            )}
            </select>
          :
          <span>{ assigned === this.props.currentUserId
              ? "Me"
              : username }
            </span>
          }

          { mine && received && owner != this.props.currentUserId && " Delivered!"}

        </div>
        { this.state.showMessages &&
          <div className='taskMessages'>
            <ul>
              { this.data.messages.map(({_id, username, text})=>
                <li key={_id}><strong>{username}</strong>: {text}</li>
              )}
            </ul>
            <form onSubmit={this.sendMessage}>
              <input type="text" name="text" placeholder="Type to send a message"
                value={this.state.text}
                onChange={event => this.setState({text: event.target.value})}
              />
            </form>
          </div>
        }
      </li>
    )
  }
})
