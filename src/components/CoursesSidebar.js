import { Component } from "react"
import CoursesGroup from "./CoursesGroup"

export default class CoursesSidebar extends Component {

  render() {
    return (
      <nav className="col-md-2 d-none d-md-block bg-light sidebar" style={{ height: "100vh", position: "fixed" }}>
        <div className="sidebar-sticky mt-4">
          <ul className="nav flex-column">
            <h4 className="sidebar-heading d-flex justify-content-between align-items-center px-2 mt-4 mb-2 text-dark">
              <span className="border-bottom border-dark">Courses</span>
            </h4>
          </ul>
          <CoursesGroup items={this.props.courses} />
        </div>
      </nav>
    )
  }

}