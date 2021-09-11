import { Component } from "react"
import CoursesGroup from "./CoursesGroup"

export default class CoursesTopbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menu: false
    }
    this.toggleMenu = this.toggleMenu.bind(this)
  }

  toggleMenu() {
    this.setState({ menu: !this.state.menu })
  }

  render() {

    const show = (this.state.menu) ? "show" : ""

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light mt-1" style={{ width: "100vw" }}>
        <h4 className="sidebar-heading d-flex justify-content-between align-items-center px-2 mt-4 mb-2 text-dark">
          <span className="border-bottom border-dark">Courses</span>
        </h4>
        <button className="navbar-toggler" type="button" onClick={this.toggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={"collapse navbar-collapse " + show}>
          <div className="navbar-nav ml-auto">
            <CoursesGroup items={this.props.courses} />
          </div>
        </div>
      </nav>
    )
  }
}