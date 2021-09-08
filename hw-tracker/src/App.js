import React from "react"
import Courses from "./components/Courses"
import Header from "./components/Header"

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Header />
        <div className="container-fluid">
          <div className="row">
            <Courses />
          </div>
        </div>
    </div>
    )
  }

}

export default App
