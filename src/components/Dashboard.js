import { Component } from "react"
import TableRow from "./TableRow"
import axios from "axios"

export default class Dashboard extends Component {

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
    axios
      .post("/api/assignment/infoAll")
      .then(res => {
        let assignments = res.data.assignments
        for (let a in assignments) {
          if (assignments[a].completed && new Date(assignments[a].dueDate).getTime() < Math.floor(new Date().getTime())) {
            assignments.splice(a, 1)
          }
        }
        this.setState({
          assignments: assignments
        })
      })
      .catch(err =>
        this.setState({
          errors: err.response.data.error
        })
      )
    this.intervalID = setTimeout(this.getAssignments.bind(this), 5000)
  }

  render() {
    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h3>Dashboard</h3>
        </div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h4><strong>Upcoming Assignments</strong></h4>
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
                  {this.state.assignments.map((a) => <TableRow key={a._id} id={a._id} title={a.name} date={(a.dueDate !== null ) ? a.dueDate : ""} description={a.description} completed={a.completed} />)}
                </tbody>
              </table> : <p>No upcoming assignments</p> : <p>No upcoming assignments</p>
        }
      </div>
    )
  }
}