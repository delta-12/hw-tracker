import { Component } from "react"
import axios from "axios"
import TableRow from "./TableRow"
import { trackPromise } from "react-promise-tracker"
import { LoadingIndicator } from "./LoadingIndicator"
import ServerResponse from "./ServerResponse"

export default class CourseCards extends Component {

  constructor() {
    super()
    this.state = {
      assignments: null,
      data: {},
      errors: {}
    }
  }

  componentDidMount() {
    this.getAssignments()
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID)
  }

  getAssignments() {
    const reqData = {
      courseID: this.props.courseID
    }
    axios
      .post("/api/assignment/info", reqData)
      .then(res => {
        this.setState({
          assignments: res.data.assignments
        })
      })
      .catch(err =>
        this.setState({
          errors: err.response.data.error
        })
      )
    this.intervalID = setTimeout(this.getAssignments.bind(this), 5000)
  }

  onClick = e => {
    e.preventDefault()
    alert('click')
  }

  deleteCourse = e => {
    e.preventDefault()
    const reqData = {
      courseID: this.props.courseID
    }
    this.setState({
      data: {},
      errors: {}
    })
    trackPromise(
      axios
        .post("/api/course/deleteCourse", reqData)
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
    )
  }

  render() {
    const {data} = this.state
    const {errors} = this.state
    return (
      <div>
        <LoadingIndicator text="Adding assignment..."/>
        {
          (data !== undefined) ?
            (data.success !== undefined) ?
              (data.success) ? <ServerResponse color="mediumseagreen" text={"Successfully deleted course."} /> :
                (errors.error !== undefined) ? <ServerResponse color="red" text={errors.error} /> : null :
              (errors.error !== undefined) ? <ServerResponse color="red" text={errors.error} /> : null :
            (errors.error !== undefined) ? <ServerResponse color="red" text={errors.error} /> : null
        }
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h3>{this.props.name}</h3>
          <button className="btn btn-secondary" onClick={this.deleteCourse}>Delete Course</button>
        </div>
        <div className="row border-bottom">
          <div className="col-xl-3">
            <p><strong>Days: </strong>{this.props.days}</p>
            <p><strong>Time: </strong>{ (this.props.startTime != null && this.props.startTime !== "") ? this.props.startTime + " - " + this.props.endTime : null }</p>
            <p><strong>Instructor: </strong>{this.props.instructor}</p>
            <p><strong>Location: </strong>{this.props.location}</p>
          </div>
        </div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h4><strong>Assignments</strong></h4>
          {/* <button className="btn btn-primary" onClick={this.onClick}>+ Add Assignment</button> */}
        </div>
        {
          (this.state.assignments !== null) ?
            (this.state.assignments.length !== 0) ?
              <table className="table table-hover">
                <tbody>
                  {this.state.assignments.map((a) => <TableRow key={a._id} title={a.name} date={(a.dueDate !== null ) ? a.dueDate : ""} description={a.description} />)}
                </tbody>
              </table> : <p>No assignments</p> : <p>No assignments</p>
        }
      </div>
    )
  }
}