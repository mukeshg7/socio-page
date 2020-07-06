import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'

class Profile extends Component {
    state = {
        userName: "",
        email: "",
    }
    componentDidMount() {
        let path = this.props.history.location.pathname.slice(9);
        Axios.get(`http://localhost:3000/user/${path}`, {withCredentials: true})
            .then(res => {
                if(res.status === 200) {
                    this.setState({
                        userName: res.data.userName,
                        email: res.data.email,
                    })
                    this.props.loginUser(path);
                } else {
                    this.props.history.push({
                        pathname: '/login'
                    })
                }
            })
            .catch(err => console.log(err));
    }
    
    render() {
        return (
            <div className="container">
                <h1>Profile Page</h1>
                <h2>Hello { this.state.userName }</h2>
                <p>Your Email-id: { this.state.email }</p>
                <Link to="/addpost"><button className="waves-effect waves-light btn">Add Post!</button></Link>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loginUser:(userId) => dispatch(login(userId)),
        logoutUser: () => dispatch(logout()),
    }
}

export default connect(null, mapDispatchToProps)(Profile);