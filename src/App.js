import { Component } from "react"
import axios from "axios"
import Header from "./components/Header"
import CoursesSidebar from "./components/CoursesSidebar"
import CoursesTopbar from "./components/CoursesTopbar"
import Dashboard from "./components/Dashboard.js"
import CourseCard from "./components/CourseCard"
import AddCourse from "./components/AddCourse"
import AddAssignment from "./components/AddAssignment"

class App extends Component {

  constructor() {
    super()
    this.state = {
      courses: null,
      course: null,
      error: null,
      key: "dashboard",
      windowWidth: window.innerWidth
    }
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
    const reqData = {}
    axios
      .get("/api/course/info", reqData)
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

  render() {

    const { windowWidth } = this.state

    if (this.state.courses !== null) {

      const courses = this.state.courses.map((c) => <li key={c._id} id={c._id} onClick={this.onCourseClick} className="nav-item justify-content-between align-items-center px-2 mt-1 mb-1" style={{ cursor: "pointer" }}>{c.name}</li>)
      const dashboardReturn = <li key="dashboardReturn" id="dashboard" onClick={this.onCourseClick} className="nav-item justify-content-between align-items-center px-2 mt-1 mb-1" style={{ cursor: "pointer" }}>Dashboard</li>
      const addCourse = <li key="addCourse" id="AddCourse" onClick={this.onCourseClick} className="nav-item justify-content-between align-items-center px-2 mt-1 mb-1" style={{ cursor: "pointer" }}>+ Add Course</li>
      const addAssignment = <li key="addAssingment" id="AddAssignment" onClick={this.onCourseClick} className="nav-item justify-content-between align-items-center px-2 mt-1 mb-1" style={{ cursor: "pointer" }}>+ Add Assignment</li>
      courses.push(<li key="br"><br></br></li>, dashboardReturn, addCourse, addAssignment)
      
      const courseInfo = this.state.courses.map((c) => <CourseCard key={c._id} courseID={c._id} name={c.name} startTime={c.startTime} endTime={c.endTime} days={c.days} instructor={c.instructor} location={c.location} addAssignment={this.onCourseClick} />)
      const dashboard = <Dashboard key="dashboard" />
      const addCourseCard = <AddCourse key="AddCourse" />
      const addAssignmentCard = <AddAssignment key="AddAssignment" course={this.state.course} />
      courseInfo.push(dashboard, addCourseCard, addAssignmentCard)

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
              <main className="col-md-9 ml-sm-auto col-lg-10 px-4 mt-5" style={ (windowWidth > 767) ? { marginLeft: "17%" } : null }>
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

export default App
