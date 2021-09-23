import { Component } from "react"

export default class CoursesGroup extends Component {
  render() {
    return (
      <ul className="nav flex-column">
        {this.props.items}
      </ul>
    )
  }
}