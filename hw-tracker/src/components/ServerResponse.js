import React from "react"

export default class ServerResponse extends React.Component {
  render() {
    const style = {
      height: 40,
      width: "100%",
      display: "flex",
      justifyContent: "left",
      alignItems: "left",
      verticalAlign: "middle",
      paddingTop: 10,
      paddingLeft: 10,
      marginBottom: 16,
      borderRadius: 5,
      backgroundColor: this.props.color
    }
    return (
      <div style={style}>
        <p>{this.props.text}</p>
      </div>
    )
  }
}