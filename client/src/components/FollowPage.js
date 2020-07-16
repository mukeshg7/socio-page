import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'
import FollowCard from './FollowCard'

class Follow extends Component {
    state = {
        users: [], 
        userId: this.props.userId,
        userName: this.props.userName,
        isLoggedIn: false,
    }
    componentDidMount() {
        Axios.get('http://localhost:3000/followpage', { withCredentials: true })
            .then(res => {
                if(res.status === 200) {
                    this.props.loginUser(res.data.userId, res.data.userName);
                    this.setState({
                        users: res.data.users,
                        isLoggedIn: true,
                    });
                } else {
                    this.props.logoutUser();
                }
            })
    }
    render() {
        const users = this.state.users;
        const body = this.state.isLoggedIn ? (
            users.map((user) => {
                return (
                    <div className="col s4">
                        <FollowCard user={user} />
                    </div>
                )
            })
        ) : (
            <div><h4>Please Login/Signup to follow people!</h4></div>
        );
        return (
            <div>
                <h4 className="center">Follow Suggestion!</h4>
                <div className="container">
                    <div className="row">{body}</div>
                </div>
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

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userId: state.userId,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Follow);
