import React from "react"
import axios from "axios"
import classnames from "classnames"

export default class TableRow extends React.Component {

  constructor() {
    super()
    this.state = {
      name: "",
      courseID: "",
      dueDate: null,
      type: "",
      description: "",
      edit: false,
      data: {},
      errors: {}
    }
  }

  componentDidMount() {
    this.setState({
      name: this.props.title,
      description: this.props.description
    })
  }

  deleteAssignment = e => {
    e.preventDefault()
    const reqData = {
      assignmentID: this.props.id
    }
    this.setState({
      data: {},
      errors: {}
    })
    axios
      .post("/api/assignment/deleteAssignment", reqData)
      .then(res => {
        this.setState({
          data: res.data
        })
      })
      .catch(err =>
        this.setState({
          error: err.response.data.error
        })
      )
  }

  toggleEdit = () => {
    (this.state.edit) ? this.setState({ edit: false }) : this.setState({ edit: true }) 
  }

  changeCompletion = e => {
    e.preventDefault()
    if (this.props.completed) {
      this.updateAssignment({completed: false})
    } else {
      this.updateAssignment({completed: true})
    }
  }

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  onDayChange = e => {
    this.setState({
      [e.target.id]: new Date(e.target.value)
    })
  }

  editAssignment = e => {
    e.preventDefault()
    let update = {}
    if (this.state.name !== "") {
      update["name"] = this.state.name
    }
    if (this.state.dueDate !== null) {
      update["dueDate"] = this.state.dueDate
    }
    if (this.state.type !== "") {
      update["type"] = this.state.type
    }
    if (this.state.description !== "") {
      update["description"] = this.state.description
    }
    this.updateAssignment(update)
    this.toggleEdit()
  }

  updateAssignment = update => {
    const reqData = {
      assignmentID: this.props.id,
      update: update
    }
    this.setState({
      data: {},
      errors: {}
    })
    axios
      .post("/api/assignment/updateAssignment", reqData)
      .then(res => {
        this.setState({
          data: res.data
        })
      })
      .catch(err =>
        this.setState({
          error: err.response.data.error
        })
      )
  }

  render() {
    const {errors} = this.state
    const date = new Date(this.props.date).toLocaleString().replace(":00 ", " ")
    if (this.state.edit) {
      return (
        <tr className="table-active">
          <th scope="row"><input type="datetime-local" className={classnames((errors.dueDate !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.dueDate })} onChange={this.onDayChange} error={errors.dueDate} id="dueDate" /><small className="form-text text-danger">{errors.dueDate}</small></th>
          <td><input type="text" className={classnames((errors.name !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.name })} onChange={this.onChange} value={this.state.name} error={errors.name} placeholder={this.props.title} id="name"></input><small className="form-text text-danger">{errors.name}</small></td>
          {
            (this.props.completed) ? <td><p className="text-success">Complete</p></td> : <td><p className="text-danger">Incomplete</p></td>
          }
          <td><input type="text" className={classnames((errors.description !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.description })} onChange={this.onChange} value={this.state.description} error={errors.description} placeholder={this.props.description} id="description"></input><small className="form-text text-danger">{errors.description}</small></td>
          <td><button className="btn btn-primary" onClick={this.editAssignment}>Save Changes</button></td>
          <td><button className="btn btn-dark" onClick={this.toggleEdit}>Discard</button></td>
          <td><button className="btn" style={{border: "none", color: "#2780e3"}} onClick={this.deleteAssignment}>Delete</button></td>
        </tr>
      )
    }
    return (
      <tr className={(new Date(this.props.date).getTime() < Math.floor(new Date().getTime())) ? (this.props.completed) ? "table-success" : "table-danger" : "table-default"}>
        <th scope="row">{(date === "Invalid Date") ? "" : date}</th>
        <td>{this.props.title}</td>
        {
          (this.props.completed) ? <td><p className="text-success">Complete</p></td> : <td><p className="text-danger">Incomplete</p></td>
        }
        <td>{this.props.description}</td>
        <td><button className="btn" style={{border: "none", color: "#2780e3"}} onClick={this.changeCompletion}>{ (this.props.completed) ? "Mark Incomplete" : "Mark Complete" }</button></td>
        <td><button className="btn" style={{border: "none", color: "#2780e3"}} onClick={this.toggleEdit}>Edit</button></td>
        <td><button className="btn" style={{border: "none", color: "#2780e3"}} onClick={this.deleteAssignment}>Delete</button></td>
      </tr>
    )
  }
}