App = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState() {
    return { text: '', hideCompleted: false }
  },

  getMeteorData() {
    let query = this.state.hideCompleted
      ? { checked: {$ne: true}}
      : {}

    return {
      tasks: Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
      incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user()
    }
  },

  toggleHideCompleted() {
    this.setState({ hideCompleted: !this.state.hideCompleted })
  },

  handleSubmit(event) {
    event.preventDefault()

    Meteor.call("addTask", this.state.text)

    this.setState({text: ''})
  },

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.data.incompleteCount})</h1>

          <label className='hide-completed'>
            <input type='checkbox' readOnly={true}
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted}
            />
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper />

          { this.data.currentUser &&
            <form className="new-task" onSubmit={this.handleSubmit}>
              <input type="text" name="text" placeholder="Type to add new tasks"
                value={this.state.text}
                onChange={event => this.setState({text: event.target.value})}
              />
            </form>
          }
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    )
  },

  renderTasks() {
    const currentUserId = this.data.currentUser && this.data.currentUser._id;

    return this.data.tasks.map(task => {
      return <Task key={task._id} task={task} currentUserId={currentUserId} />
    })
  }
})
