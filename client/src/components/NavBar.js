import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import Axios from 'axios'
import { connect } from 'react-redux'
import { logout } from '../actions/action'

const handleLogout = (props) => {
        Axios.get('http://localhost:5000/logout', {withCredentials: true})
            .then(res => {
                if(res.status === 200) {
                    alert("Successfully Logged Out!");
                    props.logoutUser();
                    props.history.push({
                        pathname: `/login`
                    });
                } else {
                    alert("Something went wrong!");
                    window.location.reload(true);
                }
            })
            .catch(err => console.log(err));
    }

function NavBar (props) {
    const Buttons = props.isLoggedIn ? (
            <div>
                <li><Link to="/addpost">Add Post!</Link></li>
                <li><Link to="/followpage">Follow</Link></li>
                <li><Link to={{ pathname: `/profile/${props.userId}` }}>Profile</Link></li>
                <li><a onClick={() => handleLogout(props)}>Logout</a></li>
            </div>
    ) : (
        <div>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
        </div>
    );
    return (
        <div>
            <nav>
                <div className="nav-wrapper">
                    <Link to="/" className="brand-logo">SocioPage</Link>
                    <ul id="nav-mobile" className="right">
                        {Buttons}
                    </ul>
                </div>
            </nav>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userId: state.userId,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        //loginUser:(userId) => dispatch(login(userId)),
        logoutUser: () => dispatch(logout()),
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
