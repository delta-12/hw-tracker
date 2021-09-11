import { Component } from "react"
import CoursesSidebar from "./components/CoursesSidebar"
import CoursesTopbar from "./components/CoursesTopbar"
import Header from "./components/Header"

class App extends Component {

  constructor() {
    super()
    this.state = {
      data: null,
      error: null,
      key: null,
      windowWidth: window.innerWidth
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize)
    // this.getData()
  }

  componentWillUnmount() {
    // clearTimeout(this.intervalID)
    window.addEventListener("resize", this.handleResize)
  }

  handleResize = (e) => {
    e.preventDefault()
    this.setState({
      windowWidth: window.innerWidth
    })
  }

  render() {

    const { windowWidth } = this.state
    console.log(windowWidth)

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
