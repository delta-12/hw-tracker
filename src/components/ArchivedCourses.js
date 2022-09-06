import { Component } from "react"
import ArchivedCourse from "./ArchivedCourse"
import axios from "axios"

export default class ArchivedCourses extends Component {

  state = {
    courses: null,
    errors: {}
  }

  componentDidMount() {
    this.getArchivedCourses()
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID)
  }

  getArchivedCourses() {
    const reqData = { userID: this.props.userID }
    axios
      .post("/api/course/archive", reqData)
      .then(res => {
        this.setState({
          courses: res.data.courses
        })
      })
      .catch(err =>
        this.setState({
          errors: err.response.data.error
        })
      )
    this.intervalID = setTimeout(this.getArchivedCourses.bind(this), 5000)
  }

  render() {
    return (
      <div>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h3>Archived Courses</h3>
        </div>
        {
          (this.state.courses !== null) ?
            (this.state.courses.length !== 0) ?
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Date Archived</th>
                    <th scope="col">Name</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.courses.map((a) => <ArchivedCourse key={a._id} id={a._id} userID={this.props.userID} courseID={a._id} title={a.name} date={a.dateArchived} />)}
                </tbody>
              </table> : <p>No archived courses</p> : <p>No archived courses</p>
        }
      </div>
    )
  }
}