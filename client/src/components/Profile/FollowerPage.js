import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../../actions/action'
import FolloweringCard from './FolloweringCard'

class FollowerPage extends Component {
    state = {
        followerUsers: [], 
        thisPageUserId: this.props.thisPageUserId,
        userId: this.props.userId,
        userName: this.props.userName,
        isLoggedIn: true,
        message: 'Loading...'
    }
    componentDidMount() {
        let path = this.state.thisPageUserId;
        Axios.get(`http://localhost:3000/follower/${path}`, { withCredentials: true })
            .then(res => {
                if(res.status === 207) {
                    this.props.logoutUser();
                    this.props.history.push({
                        pathname: `/login`,
                    })
                } else if(res.status === 200) {
                    this.setState({
                        followerUsers: res.data.followerUsers,
                        isLoggedIn: true,
                    });
                    if(this.state.followerUsers.length === 0) {
                        this.setState({
                            message: 'No Followers',
                        });
                    }
                }
            })
    }
    render() {
        const followerUsers = this.state.followerUsers;
        const list = followerUsers.length ? (
            followerUsers.map((user) => {
                return (
                    <div className="col xl6 l12 m6 s12">
                        <FolloweringCard user={user} key={user.userId} userId={this.state.userId}/>
                    </div>
                )
            })
        ) : (
            <div><h4>{this.state.message}</h4></div>
        );
        const body = this.state.isLoggedIn ? (
            <div>{list}</div>
        ) : (
            <div><h4>Please Login/Signup to view people!</h4></div>
        );
        return (
            <div>
                <h4 className="center">Followers {this.state.userName}</h4>
                    <div className="row">{body}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(FollowerPage);
