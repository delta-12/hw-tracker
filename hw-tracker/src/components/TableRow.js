import React from "react"

export default class TableRow extends React.Component {
  render() {
    return (
      // <tr className={(new Date(this.props.date).getTime() < Math.floor(new Date().getTime()) / 1000) ? "table-active" : "table-default"}>
      <tr>
        <th scope="row">{new Date(this.props.date).toUTCString().replace("00:00:00 GMT", "")}</th>
        <td></td>
        <td>{this.props.title}</td>
        <td></td>
        <td>{this.props.description}</td>
        <td></td>
        
      </tr>
    )
  }
}