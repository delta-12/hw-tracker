import { Component } from "react"
import axios from "axios"
import classnames from "classnames"
import { trackPromise } from "react-promise-tracker"
import { LoadingIndicator } from "./LoadingIndicator"
import ServerResponse from "./ServerResponse"

export default class AddAssignment extends Component {

  constructor() {
    super()
    this.state = {
      name: "",
      courseID: "",
      dueDate: null,
      type: "",
      description: "",
      courses: null,
      data: {},
      errors: {}
    }
  }

  componentDidMount() {
    axios
      .get("/api/course/info")
      .then(res => {
        this.setState({
          courses: res.data.courses
        })
        if (res.data.courses !== null && res.data.courses.length !== 0) {
          this.setState({
            courseID: res.data.courses[0]._id
          })
        }
      })
      .catch(err => 
        this.setState({
          errors: err.response.data
        })
      )
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

  onSubmit = e => {
    e.preventDefault()
    const newAssignment = {
      name: this.state.name,
      courseID: this.state.courseID,
      dueDate: this.state.dueDate,
      type: this.state.type,
      description: this.state.description
    }
    this.setState({
      data: {},
      errors: {}
    })
    trackPromise(
      axios
        .post("/api/assignment/createAssignment", newAssignment)
        .then(res => {
          this.setState({
            data: res.data
          })
        })
        .catch(err => 
          this.setState({
            errors: err.response.data
          }))
    )
  }

  render() {
    const {data} = this.state
    const {errors} = this.state
    let courses
    (this.state.courses !== null) ? courses = this.state.courses.map((course) => <option key={course._id} value={course._id}>{course.name}</option>) : courses = ""
    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h3>Add Assignment</h3>
        </div>
        <LoadingIndicator text="Adding assignment..."/>
        {
          (data !== undefined) ?
            (data.success !== undefined) ?
              (data.success) ? <ServerResponse color="mediumseagreen" text={"Successfully added assignment."} /> :
                (errors.error !== undefined) ? <ServerResponse color="red" text={errors.error} /> : null :
              (errors.error !== undefined) ? <ServerResponse color="red" text={errors.error} /> : null :
            (errors.error !== undefined) ? <ServerResponse color="red" text={errors.error} /> : null
        }
        <form onSubmit={this.onSubmit}>
          <table className="table">
            <tbody>
              <tr>
                <th scope="row">Name</th>
                <td></td>
                <td>
                  <div><input type="text" className={classnames((errors.name !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.name })} onChange={this.onChange} value={this.state.name} error={errors.name} placeholder="Name" id="name"></input><small className="form-text text-danger">{errors.name}</small></div>
                </td>
              </tr>
              <tr>
                <th scope="row">Due Date</th>
                <td></td>
                <td>
                  <div><input type="date" className={classnames((errors.dueDate !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.dueDate })} onChange={this.onDayChange} error={errors.dueDate} id="dueDate" /><small className="form-text text-danger">{errors.dueDate}</small></div>
                </td>
              </tr>
              <tr>
                <th scope="row">Description</th>
                <td></td>
                <td>
                  <div><input type="text" className={classnames((errors.description !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.description })} onChange={this.onChange} value={this.state.description} error={errors.description} placeholder="Description" id="description"></input><small className="form-text text-danger">{errors.description}</small></div>
                </td>
              </tr>
              <tr>
                <th scope="row">Course</th>
                <td></td>
                <td>
                  <div>
                    <select className={classnames((errors.courseID !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.courseID })} onChange={this.onChange} value={this.state.courseID} error={errors.courseID} id="courseID">
                      { courses }
                    </select>
                    <small className="form-text text-danger">{errors.courseID}</small>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <button className="btn btn-primary" type="submit">Add Assignment</button>
        </form>
      </div>
    )
  }
}