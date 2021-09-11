import { Component } from "react"
import axios from "axios"
import Header from "./components/Header"
import CoursesSidebar from "./components/CoursesSidebar"
import CoursesTopbar from "./components/CoursesTopbar"

class App extends Component {

  constructor() {
    super()
    this.state = {
      courses: null,
      error: null,
      key: null,
      windowWidth: window.innerWidth
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize)
    this.getData()
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

  getData() {
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
    this.intervalID = setTimeout(this.getData.bind(this), 5000)
  }

  render() {

    const { windowWidth } = this.state

    if (this.state.courses !== null) {
      const courses = this.state.courses.map((c) => <li key={c._id} id={c._id} className="nav-item justify-content-between align-items-center px-2 mt-1 mb-1" style={{ cursor: "pointer" }}>{c.name}</li>)
      return (
        <div className="App">
          <Header />
          <div className="container-fluid">
            <div className="row">
              {
                (windowWidth > 900) ? <CoursesSidebar courses={courses} /> : <CoursesTopbar courses={courses} />
              }
            </div>
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
