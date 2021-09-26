import React from "react"
import axios from "axios"

export default class TableRow extends React.Component {

  constructor() {
    super()
    this.state = {
      data: {},
      errors: {}
    }
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

  changeCompletion = e => {
    e.preventDefault()
    if (this.props.completed) {
      this.updateAssignment({completed: false})
    } else {
      this.updateAssignment({completed: true})
    }
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
    const date = new Date(this.props.date).toLocaleString().replace(":00 ", " ")
    return (
      <tr className={(new Date(this.props.date).getTime() < Math.floor(new Date().getTime())) ? (this.props.completed) ? "table-success" : "table-danger" : "table-default"}>
        <th scope="row">{(date === "Invalid Date") ? "" : date}</th>
        <td>{this.props.title}</td>
        {
          (this.props.completed) ? <td><p className="text-success">Complete</p></td> : <td><p className="text-danger">Incomplete</p></td>
        }
        <td>{this.props.description}</td>
        <td><button className="btn" style={{border: "none", color: "#2780e3"}} onClick={this.changeCompletion}>{ (this.props.completed) ? "Mark Incomplete" : "Mark Complete" }</button></td>
        <td><button className="btn" style={{border: "none", color: "#2780e3"}} onClick={this.deleteAssignment}>Delete</button></td>
      </tr>
    )
  }
}