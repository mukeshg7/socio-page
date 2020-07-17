import React, { Component } from 'react'
import Axios from 'axios'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'

class Profile extends Component {
    state = {
        userName: "",
        email: "",
        followersCount: 0,
        followingCount: 0,
        isThisUser: false,
    }
    componentDidMount() {console.log('profile');
        let path = this.props.history.location.pathname.slice(9);
        Axios.get(`http://localhost:3000/user/${path}`, {withCredentials: true})
            .then(res => {
                if(res.status === 200) {
                    this.setState({
                        userName: res.data.userName,
                        email: res.data.email,
                        followersCount: res.data.followersCount,
                        followingCount: res.data.followingCount,
                        isThisUser: res.data.isThisUser,
                    })
                    if(this.state.isThisUser) {
                        this.props.loginUser(path);
                    } else {
                        this.props.loginUser(res.data.loggedInUserId);
                    }
                } else {
                    this.props.history.push({
                        pathname: '/login'
                    })
                }
            })
            .catch(err => console.log(err));
    }
    handleEdit = () => {

    }
    render() {
        const userIdOfThisPage = this.props.history.location.pathname.slice(9);
        const editButton = this.state.isThisUser ? (
                <div>
                    <button onClick={this.handleEdit} className="waves-effect waves-light btn">Edit</button>
                </div>
        ) : (
                <div></div>
        );
        return (
            <div className="container">
                <h1>Profile Page</h1>
                <h2>Hello { this.state.userName }</h2>
                <p>Your Email-id: { this.state.email }</p>
                <Link to={{ pathname: `/follower/${userIdOfThisPage}` }}>Followers: {this.state.followersCount}</Link>
                <Link to={{ pathname: `/following/${userIdOfThisPage}` }}>Following: {this.state.followingCount}</Link>
                { editButton }
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