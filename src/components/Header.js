import { Component } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import { logoutUser } from "../actions/authActions"

class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            menu: false,
            loggedIn: false
        }
        this.toggleMenu = this.toggleMenu.bind(this)
    }

    toggleMenu() {
        this.setState({ menu: !this.state.menu })
    }

    // trying to check if user is logged in
    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.setState({
                loggedIn: true
            })
        }
    }

    onLogoutClick = e => {
        e.preventDefault()
        this.props.logoutUser()
        this.setState({
            loggedIn: false
        })
    }

    render() {

        const show = (this.state.menu) ? "show" : ""

        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top p-2">
                <div className="container-fluid">
                    <div className="navbar-brand">Homework Tracker</div>
                    {
                        (this.state.loggedIn) ?
                            <>
                                <button className="navbar-toggler" type="button" onClick={this.toggleMenu}>
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className={"collapse navbar-collapse " + show}>
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    </ul>
                                    <ul className="navbar-nav">
                                        <div className="btn-toolbar">
                                            <div className="btn-group m-1">
                                                <Link style={{ textDecoration: "none" }} to="/account"><button className="btn btn-light"><i className="fas fa-user-circle"></i>Account</button></Link>
                                            </div>
                                            <div className="btn-group m-1">
                                                <button className="btn btn-dark" onClick={this.onLogoutClick}><i className="fas fa-sign-out-alt"></i>Logout</button>
                                            </div>
                                        </div>
                                    </ul>
                                </div>
                            </> : null
                    }

                </div>
            </nav>
        )
    }
}

Header.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
})
export default connect(
    mapStateToProps,
    { logoutUser }
)(Header)