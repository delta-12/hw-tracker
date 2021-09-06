import { Component } from "react"

export default class Classes extends Component {

    render() {
        return (
            <nav className="col-md-2 d-none d-md-block bg-light sidebar" style={{ height: "100vh", position: "fixed" }}>
                <div className="sidebar-sticky mt-4">
                    <ul className="nav flex-column">
                        <h4 className="sidebar-heading d-flex justify-content-between align-items-center px-2 mt-4 mb-2 text-secondary">
                        <span>Classes</span>
                        </h4>
                    </ul>
                    <li key="addClass" id="addClass" className="nav-item justify-content-between align-items-center px-2 mt-1 mb-1" style={{ cursor: "pointer" }}>+ Add Class</li>
                </div>
            </nav>
        )
    }

}