Task = React.createClass({
  mixins: [ReactMeteorData],

  proptypes: {
    task: React.PropTypes.object.isRequired,
    showPrivateButton: React.PropTypes.bool.isRequired
  },

  getMeteorData() {
    return {
      users: Meteor.users.find().fetch()
    }
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

  assignTask(event) {
    const taskId = this.props.task._id
    const userId = event.target.value
    Meteor.call("assignTask", taskId, userId)
  },

  render() {
    const { _id, checked, private, username, owner, text, assigned, received } = this.props.task,
      className = (checked ? 'checked' : '') + ' ' + (private ? 'private' : '')

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

        { owner === this.props.currentUserId &&
          <button className='toggle-private' onClick={this.togglePrivate}>
            {this.props.task.private ? "Private" : "Public"}
          </button>
        }
        <label htmlFor={_id} className='text'>
          <strong>{username}</strong>: {text}
        </label>
        <div className='assignee'>
          <span>Assigned to: </span>
          { owner === this.props.currentUserId
            ?
            <select onChange={this.assignTask}>
              {this.data.users.map(({_id, username}) =>
              <option key={_id} value={_id}>{username}</option>
            )}
          </select>
          :
          <span>{ assigned === this.props.currentUserId
              ? "Me"
              : username }
            </span>
          }

          { received && "Delivered!"}
        </div>
      </li>
    )
  }
})
