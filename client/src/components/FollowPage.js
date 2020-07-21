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
        isLoggedIn: true,
        message: 'Loading...'
    }
    componentDidMount() {
        Axios.get('http://localhost:3000/followpage', { withCredentials: true })
            .then(res => {
                if(res.status === 207) {
                    this.props.logoutUser();
                    alert("You are not LoggedIn!")
                    this.props.history.push({
                        pathname: `/login`,
                    })
                } else if(res.status === 200) {
                    this.props.loginUser(res.data.userId, res.data.userName);
                    this.setState({
                        users: res.data.users,
                        isLoggedIn: true,
                    });
                    if(this.state.users.length === 0) {
                        this.setState({
                            message: 'No Follow Suggestion!',
                        })
                    }
                } else {
                    alert("Some error occured! Please refresh the page.")
                }
            })
    }
    render() {
        const users = this.state.users;
        const list = users.length ? (
            users.map((user) => {
                return (
                    <div className="col l4 m6 s6">
                        <FollowCard user={user} />
                    </div>
                )
            })
        ) : (
            <div><h4>{this.state.message}</h4></div>
        );
        const body = this.state.isLoggedIn ? (
            <div>{list}</div>
        ) : (
            <div><h4>Please Login/Signup to follow people!</h4></div>
        );
        return (
            <div>
                <h4 className="center" style={{padding: 20+'px',}}>Follow Suggestion!</h4>
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
