import { Component } from "react"
import axios from "axios"
import classnames from "classnames"
import TableRow from "./TableRow"
import { trackPromise } from "react-promise-tracker"
import { LoadingIndicator } from "./LoadingIndicator"
import ServerResponse from "./ServerResponse"

export default class CourseCards extends Component {

  constructor() {
    super()
    this.state = {
      name: "",
      startTime: "",
      endTime: "",
      days: [
        { name: "M", n: 0, checked: false },
        { name: "Tu", n: 1, checked: false },
        { name: "W", n: 2, checked: false },
        { name: "Th", n: 3, checked: false },
        { name: "F", n: 4, checked: false },
        { name: "S", n: 5, checked: false },
        { name: "Su", n: 6, checked: false }
      ],
      instructor: "",
      location: "",
      assignments: null,
      edit: false,
      requestType: [],
      data: {},
      errors: {}
    }
  }

  componentDidMount() {
    this.getAssignments()
    this.clearReqData()
    let stateDays = [...this.state.days]
    for (let day in this.props.days) {
      stateDays[this.props.days[day].n] = this.props.days[day]
    }
    this.setState({
      name: this.props.name,
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      days: stateDays,
      instructor: this.props.instructor,
      location: this.props.location
    })
  }

  componentWillUnmount() {
    clearTimeout(this.getAssignmentsInterval)
    clearTimeout(this.clearReqDataInterval)
  }

  getAssignments() {
    const reqData = {
      courseID: this.props.courseID,
      userID: this.props.userID
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
    this.getAssignmentsInterval = setTimeout(this.getAssignments.bind(this), 5000)
  }

  clearReqData() {
    this.setState({
      requestType: [],
      data: {},
      errors: {}
    })
    this.clearReqDataInterval = setTimeout(this.clearReqData.bind(this), 10000)
  }

  toggleEdit = () => {
    (this.state.edit) ? this.setState({ edit: false }) : this.setState({ edit: true })
  }

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  onCheck = e => {
    let days = [...this.state.days]
    let day = { ...days[e.target.value] }
    if (day.checked) {
      day.checked = false
    } else {
      day.checked = true
    }
    days[e.target.value] = day
    this.setState({
      days
    })
  }

  editCourse = e => {
    e.preventDefault()
    let update = {}
    if (this.state.name !== "") {
      update["name"] = this.state.name
    }
    if (this.state.startTime !== "") {
      update["startTime"] = this.state.startTime
    }
    if (this.state.endTime !== "") {
      update["endTime"] = this.state.endTime
    }
    if (this.state.instructor !== "") {
      update["instructor"] = this.state.instructor
    }
    if (this.state.location !== "") {
      update["location"] = this.state.location
    }
    update["days"] = this.state.days
    this.updateCourse(update)
    this.toggleEdit()
  }

  updateCourse = update => {
    const reqData = {
      courseID: this.props.courseID,
      update: update,
      userID: this.props.userID
    }
    this.setState({
      requestType: ["Updating", "updated"],
      data: {},
      errors: {}
    })
    trackPromise(
      axios
        .post("/api/course/updateCourse", reqData)
        .then(res => {
          this.setState({
            data: res.data
          })
        })
        .catch(err => {
          this.setState({
            errors: err.response.data
          })
          console.log(this.state.error)
          this.toggleEdit()
        })
    )
  }

  archiveCourse = e => {
    e.preventDefault()
    let update = {}
    update["archived"] = (this.props.archived) ? false : true
    const reqData = {
      courseID: this.props.courseID,
      update: update,
      userID: this.props.userID
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
    update["name"] = this.props.name
    update["dateArchived"] = (this.props.archived) ? null : Math.floor(new Date().getTime())
    this.updateCourse(update)
  }

  deleteCourse = e => {
    e.preventDefault()
    const reqData = {
      courseID: this.props.courseID,
      userID: this.props.userID
    }
    this.setState({
      requestType: ["Deleting", "deleted"],
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
            errors: err.response.data
          })
        )
    )
  }

  parseDays = () => {
    let parsedDays = ""
    for (let day in this.state.days) {
      if (this.state.days[day].checked) {
        parsedDays += this.state.days[day].name + ","
      }
    }
    return parsedDays.substring(0, parsedDays.length - 1)
  }

  render() {
    const { data } = this.state
    const { errors } = this.state
    const days = this.parseDays()
    const dayCheckBoxes = this.state.days.map((d) =>
      <div key={d.n} className="form-check col-sm-1" style={{ paddingBottom: "1.5%", paddingRight: "2%" }}>
        <input className="form-check-input" type="checkbox" value={d.n} checked={(d.checked) ? "checked" : ""} onChange={this.onCheck} />
        <label className="form-check-label">{d.name}</label>
      </div>
    )
    return (
      <div>
        <LoadingIndicator text={this.state.requestType[0] + " course..."} />
        {
          (data !== undefined) ?
            (data.success !== undefined) ?
              (data.success) ? <ServerResponse color="mediumseagreen" text={"Successfully " + this.state.requestType[1] + " course."} /> :
                (errors.error !== undefined) ? <ServerResponse color="red" text={errors.error} /> : null :
              (errors.error !== undefined) ? <ServerResponse color="red" text={errors.error} /> : null :
            (errors.error !== undefined) ? <ServerResponse color="red" text={errors.error} /> : null
        }
        {
          (this.state.edit) ?
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <div>
                <input type="text" className={classnames((errors.name !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.name })} onChange={this.onChange} value={this.state.name} error={errors.name} placeholder="Name" id="name"></input><small className="form-text text-danger">{errors.name}</small>
              </div>
              <div>
                <button className="btn btn-primary" style={{ marginRight: "10px" }} onClick={this.editCourse}>Save Changes</button>
                <button className="btn btn-secondary" onClick={this.toggleEdit}>Discard</button>
              </div>
            </div>
            :
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h3>{(this.props.archived) ? this.props.name + " (Archived)" : this.props.name}</h3>
              <div>
                <button className="btn btn-outline-secondary" style={{ marginRight: "10px" }} onClick={this.toggleEdit}>Edit</button>
                <button className="btn btn-outline-secondary" style={{ marginRight: "10px" }} onClick={this.archiveCourse}>{(this.props.archived) ? "Unarchive" : "Archive"}</button>
                <button className="btn btn-secondary" onClick={this.deleteCourse}>Delete Course</button>
              </div>
            </div>
        }
        {
          (this.state.edit) ?
            <div className="row border-bottom">
              <div className="col-xl-3">
                <div><strong>Days: </strong>{dayCheckBoxes}</div>
                <p><strong>Start Time: </strong><input type="time" className={classnames((errors.startTime !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.startTime })} onChange={this.onChange} value={this.state.startTime} error={errors.startTime} placeholder={this.props.startTime} id="startTime"></input><small className="form-text text-danger">{errors.startTime}</small></p>
                <p><strong>End Time: </strong><input type="time" className={classnames((errors.endTime !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.endTime })} onChange={this.onChange} value={this.state.endTime} error={errors.endTime} placeholder={this.props.endTime} id="endTime"></input><small className="form-text text-danger">{errors.endTime}</small></p>
                <p><strong>Instructor: </strong><input type="text" className={classnames((errors.instructor !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.instructor })} onChange={this.onChange} value={this.state.instructor} error={errors.instructor} placeholder="Instructor" id="instructor"></input><small className="form-text text-danger">{errors.instructor}</small></p>
                <p><strong>Location: </strong><input type="text" className={classnames((errors.location !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.location })} onChange={this.onChange} value={this.state.location} error={errors.location} placeholder="Location" id="location"></input><small className="form-text text-danger">{errors.location}</small></p>
              </div>
            </div>
            :
            <div className="row border-bottom">
              <div className="col-xl-3">
                <p><strong>Days: </strong>{days}</p>
                <p><strong>Time: </strong>{(this.props.startTime != null && this.props.startTime !== "") ? this.props.startTime + " - " + this.props.endTime : null}</p>
                <p><strong>Instructor: </strong>{this.props.instructor}</p>
                <p><strong>Location: </strong>{this.props.location}</p>
              </div>
            </div>
        }
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h4><strong>Assignments</strong></h4>
          <button className="btn btn-primary" id="AddAssignment" value={this.props.courseID} onClick={this.props.addAssignment}>+ Add Assignment</button>
        </div>
        {
          (this.state.assignments !== null) ?
            (this.state.assignments.length !== 0) ?
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Name</th>
                    <th scope="col">Status</th>
                    <th scope="col">Description</th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.assignments.map((a) => <TableRow key={a._id} id={a._id} userID={this.props.userID} title={a.name} date={(a.dueDate !== null) ? a.dueDate : ""} description={a.description} completed={a.completed} />)}
                </tbody>
              </table> : <p>No assignments</p> : <p>No assignments</p>
        }
      </div>
    )
  }
}