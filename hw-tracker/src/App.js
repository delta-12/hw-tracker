import React from "react"
import Classes from "./components/Classes"

import Header from "./components/Header"

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Header />
        <div className="container-fluid">
          <div className="row">
            <Classes />
          </div>
        </div>
    </div>
    )
  }

}

export default App
