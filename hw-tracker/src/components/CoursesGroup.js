import { Component } from "react"

export default class CoursesGroup extends Component {
  render() {
    return (
      <ul className="nav flex-column">
        {this.props.items}
        <li key="addCourse" id="addCourse" className="nav-item justify-content-between align-items-center px-2 mt-1 mb-1" style={{ cursor: "pointer" }}>+ Add Course</li>
      </ul>
    )
  }
}