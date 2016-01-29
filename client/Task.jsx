Task = React.createClass({
  proptypes: {
    task: React.PropTypes.object.isRequired,
    showPrivateButton: React.PropTypes.bool.isRequired
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

  render() {
    const { _id, checked, private, username, text } = this.props.task,
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

        { this.props.showPrivateButton &&
        <button className='toggle-private' onClick={this.togglePrivate}>
        {this.props.task.private ? "Private" : "Public"}
        </button>
        }
        <label htmlFor={_id} className='text'>
          <strong>{username}</strong>: {text}
        </label>
        { this.props.showPrivateButton &&
          <select>
          </select>
        }
      </li>
    )
  }
})
