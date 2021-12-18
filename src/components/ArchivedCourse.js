import React from "react"
import axios from "axios"

export default class ArchivedCourse extends React.Component {

    state = {
      name: "",
      dateArchived: null,
      data: {},
      errors: {}
    }

  componentDidMount() {
    this.setState({
      name: this.props.title,
      dateArchived: this.props.dateArchived
    })
  }

  unarchiveCourse = () => {
    let update = {}
    update["name"] = this.props.title
    update["archived"] = false
    const reqData = {
        courseID: this.props.courseID,
        update: update
    }
    this.setState({
        data: {},
        errors: {}
    })
    axios
      .post("/api/course/updateCourse", reqData)
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

  unarchiveAssignments = () => {
    let update = {}
    update["archived"] = false
    const reqData = {
      courseID: this.props.courseID,
      update: update
    }
    axios
      .post("/api/assignment/updateAssignments", reqData)
      .then(res => {
        this.setState({
          data: res.data
        })
      })
      .catch(err => {
        this.setState({
          errors: err.response.data
        })
      })
  }

  unarchive = e => {
    e.preventDefault()
    this.unarchiveAssignments()
    this.unarchiveCourse()
  }

  render() {
    const date = new Date(this.props.date).toLocaleString().replace(":00 ", " ")
    return (
      <tr>
        <th scope="row">{(date === "Invalid Date") ? "" : date}</th>
        <td>{this.props.title}</td>
        <td><button className="btn" style={{border: "none", color: "#2780e3"}} onClick={this.unarchive}>Unarchive</button></td>
      </tr>
    )
  }
}