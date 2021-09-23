import { Component } from "react"
import axios from "axios"
import classnames from "classnames"
import { trackPromise } from "react-promise-tracker"
import { LoadingIndicator } from "./LoadingIndicator"
import ServerResponse from "./ServerResponse"

export default class AddCourse extends Component {

  constructor() {
    super()
    this.state = {
      name: "",
      startTime: "",
      endTime: "",
      days: [
        {name: "M", n: 0, checked: false},
        {name: "Tu", n: 1, checked: false},
        {name: "W", n: 2, checked: false},
        {name: "Th", n: 3, checked: false},
        {name: "F", n: 4, checked: false},
        {name: "S", n: 5, checked: false},
        {name: "Su", n: 6, checked: false}
      ],
      instructor: "",
      location: "",
      data: {},
      errors: {}
    }
  }

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  onCheck = e => {
    let days = [...this.state.days]
    let day = {...days[e.target.value]}
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

  onSubmit = e => {
    e.preventDefault()
    let days = [...this.state.days]
    let parsedDays = ""
    for (let day in days) {
      if (days[day].checked) {
        parsedDays += days[day].name + ","
      }
    }
    parsedDays = parsedDays.substring(0, parsedDays.length -1)
    const newCourse = {
      name: this.state.name,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      days: parsedDays,
      instructor: this.state.instructor,
      location: this.state.location
    }
    this.setState({
      data: {},
      errors: {}
    })
    trackPromise(
      axios
        .post("/api/course/addCourse", newCourse)
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

    const days = this.state.days.map((d) => 
      <div key={d.n} className="form-check col-sm-1" style={{ paddingBottom: "1.5%", paddingRight: "2%" }}>
        <input className="form-check-input" type="checkbox" value={d.n} onChange={this.onCheck} />
        <label className="form-check-label">{d.name}</label>
      </div>
    )

    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h3>Add Course</h3>
        </div>
        <LoadingIndicator text="Adding course..."/>
        {
          (data !== undefined) ?
            (data.success !== undefined) ?
              (data.success) ? <ServerResponse color="mediumseagreen" text={"Successfully added course."} /> :
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
                <th scope="row">Instructor</th>
                <td></td>
                <td>
                  <div><input type="text" className={classnames((errors.instructor !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.instructor })} onChange={this.onChange} value={this.state.instructor} error={errors.instructor} placeholder="Instructor" id="instructor"></input><small className="form-text text-danger">{errors.instructor}</small></div>
                </td>
              </tr>
              <tr>
                <th scope="row">Location</th>
                <td></td>
                <td>
                  <div><input type="text" className={classnames((errors.location !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.location })} onChange={this.onChange} value={this.state.location} error={errors.location} placeholder="Location" id="location"></input><small className="form-text text-danger">{errors.location}</small></div>
                </td>
              </tr>
              <tr>
                <th scope="row">Days</th>
                <td></td>
                <td className="d-flex align-items-center" style={{ paddingTop: "1.5%", paddingBottom: "1.5%"}}>
                  { days }
                </td>
              </tr>
              {/* <tr>
                <th scope="row">Start Time</th>
                <td></td>
                <td>
                  <div><input type="text" className={classnames((errors.startTime !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.startTime })} onChange={this.onChange} value={this.state.startTime} error={errors.startTime} placeholder="00:00" id="startTime"></input><small className="form-text text-danger">{errors.startTime}</small></div>
                </td>
              </tr>
              <tr>
                <th scope="row">End Time</th>
                <td></td>
                <td>
                  <div><input type="text" className={classnames((errors.endTime !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.endTime })} onChange={this.onChange} value={this.state.endTime} error={errors.endTime} placeholder="00:00" id="endTime"></input><small className="form-text text-danger">{errors.endTime}</small></div>
                </td>
              </tr> */}
            </tbody>
          </table>
          <button className="btn btn-primary" type="submit">Add Course</button>
        </form>
      </div>
    )
  }
}