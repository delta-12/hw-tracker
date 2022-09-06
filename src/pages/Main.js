import { Component } from "react"
// import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { logoutUser } from "../actions/authActions"
import axios from "axios"
import Header from "../components/Header"
import CoursesSidebar from "../components/CoursesSidebar"
import CoursesTopbar from "../components/CoursesTopbar"
import Dashboard from "../components/Dashboard.js"
import CourseCard from "../components/CourseCard"
import AddCourse from "../components/AddCourse"
import AddAssignment from "../components/AddAssignment"
import ArchivedCourses from "../components/ArchivedCourses"

class Main extends Component {

  state = {
    courses: null,
    course: null,
    error: null,
    key: "dashboard",
    windowWidth: window.innerWidth
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize)
    this.getCourses()
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID)
    window.addEventListener("resize", this.handleResize)
  }

  handleResize = (e) => {
    e.preventDefault()
    this.setState({
      windowWidth: window.innerWidth
    })
  }

  getCourses() {
    const reqData = { userID: this.props.auth.user.id }
    axios
      .post("/api/course/info", reqData)
      .then(res => {
        this.setState({
          courses: res.data.courses
        })
      })
      .catch(err =>
        this.setState({
          error: err.response.data.error
        })
      )
    this.intervalID = setTimeout(this.getCourses.bind(this), 5000)
  }

  onCourseClick = e => {
    e.preventDefault()
    this.setState({
      key: e.target.id,
      course: e.target.value
    })
  }

  onLogoutClick = e => {
    e.preventDefault()
    this.props.logoutUser()
  }

  render() {

    const { windowWidth } = this.state

    if (this.state.courses !== null) {

      const courses = this.state.courses.map((c) => <li key={c._id} id={c._id} onClick={this.onCourseClick} className="nav-item justify-content-between align-items-center px-2 mt-1 mb-1" style={{ cursor: "pointer" }}>{c.name}</li>)
      const dashboardReturn = <li key="dashboardReturn" id="dashboard" onClick={this.onCourseClick} className="nav-item justify-content-between align-items-center px-2 mt-1 mb-1" style={{ cursor: "pointer" }}>Dashboard</li>
      const archivedCourses = <li key="archivedCourses" id="ArchivedCourses" onClick={this.onCourseClick} className="nav-item justify-content-between align-items-center px-2 mt-1 mb-1" style={{ cursor: "pointer" }}>Archived Courses</li>
      const addCourse = <li key="addCourse" id="AddCourse" onClick={this.onCourseClick} className="nav-item justify-content-between align-items-center px-2 mt-1 mb-1" style={{ cursor: "pointer" }}>+ Add Course</li>
      const addAssignment = <li key="addAssingment" id="AddAssignment" onClick={this.onCourseClick} className="nav-item justify-content-between align-items-center px-2 mt-1 mb-1" style={{ cursor: "pointer" }}>+ Add Assignment</li>
      courses.push(<li key="br"><br></br></li>, dashboardReturn, archivedCourses, addCourse, addAssignment)

      const courseInfo = this.state.courses.map((c) => <CourseCard key={c._id} userID={this.props.auth.user.id} courseID={c._id} name={c.name} startTime={c.startTime} endTime={c.endTime} days={c.days} instructor={c.instructor} location={c.location} archived={c.archived} addAssignment={this.onCourseClick} />)
      const dashboard = <Dashboard key="dashboard" userID={this.props.auth.user.id} />
      const addCourseCard = <AddCourse key="AddCourse" userID={this.props.auth.user.id} />
      const addAssignmentCard = <AddAssignment key="AddAssignment" userID={this.props.auth.user.id} course={this.state.course} />
      const archivedCoursesCard = <ArchivedCourses key="ArchivedCourses" userID={this.props.auth.user.id} />
      courseInfo.push(dashboard, archivedCoursesCard, addCourseCard, addAssignmentCard)

      return (
        <div className="App">
          <Header />
          <div className="container-fluid">
            <div className="row">
              {
                (windowWidth > 900) ? <CoursesSidebar courses={courses} /> : <CoursesTopbar courses={courses} />
              }
            </div>
            {
              (windowWidth > 900 || windowWidth <= 767) ?
                <main className="col-md-9 ml-sm-auto col-lg-10 px-4 mt-5" style={(windowWidth > 767) ? { marginLeft: "17%" } : null}>
                  {courseInfo.find(el => el.key === this.state.key)}
                </main> :
                <main>
                  {courseInfo.find(el => el.key === this.state.key)}
                </main>
            }
          </div>
        </div>
      )
    }
    return (
      <div className="App">
        <Header />
        <div className="container-fluid">
          <div className="row">
            {
              (windowWidth > 900) ? <CoursesSidebar /> : <CoursesTopbar />
            }
          </div>
        </div>
      </div>
    )
  }

}

Main.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
})
export default connect(
  mapStateToProps,
  { logoutUser }
)(Main)
