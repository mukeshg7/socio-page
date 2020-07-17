import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'
import FolloweringCard from './FolloweringCard'

class FollowingPage extends Component {
    state = {
        followingUsers: [], 
        userIdOfThisPage: this.props.history.location.pathname.slice(11),
        userId: this.props.userId,
        userName: this.props.userName,
        isLoggedIn: false,
    }
    componentDidMount() {
        let path = this.props.history.location.pathname.slice(11);
        Axios.get(`http://localhost:3000/following/${path}`, { withCredentials: true })
            .then(res => {
                if(res.status === 200) {
                    this.props.loginUser(res.data.userId, res.data.userName);
                    this.setState({
                        followingUsers: res.data.followingUsers,
                        isLoggedIn: true,
                    });
                } else {
                    this.props.logoutUser();
                }
            })
    }
    render() {
        const followingUsers = this.state.followingUsers;
        const body = this.state.isLoggedIn ? (
            followingUsers.map((user) => {
                return (
                    <div className="col s4">
                        <FolloweringCard user={user} />
                    </div>
                )
            })
        ) : (
            <div><h4>Please Login/Signup to view people!</h4></div>
        );
        return (
            <div>
                <h4 className="center">People Followed by {this.state.userName}</h4>
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
        userName: state.userName,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowingPage);
