import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'
import UserPost from './UserPost'
import FollowerPage from './FollowerPage'
import FollowingPage from './FollowingPage'

class Profile extends Component {
    state = {
        userId: '',
        userName: "",
        
        thisPageUserId: '',
        thisPageUserName: '',
        thisPageEmail: "",
        followersCount: 0,
        followingCount: 0,

        isThisUser: false,

        followersButton: false,
        followingButton: false,
        showPostButton: false,
    }
    componentDidMount() {console.log('profile');
        let path = this.props.history.location.pathname.slice(9);
        Axios.get(`http://localhost:3000/user/${path}`, {withCredentials: true})
            .then(res => {
                if(res.status === 200) {
                    this.setState({
                        userId: res.data.userId,
                        userName: res.data.userName,
                        thisPageUserId: this.props.history.location.pathname.slice(9),
                        thisPageUserName: res.data.thisPageUserName,
                        thisPageEmail: res.data.thisPageEmail,
                        followersCount: res.data.followersCount,
                        followingCount: res.data.followingCount,
                    })
                    if(this.state.userId === this.state.thisPageUserId) {
                        this.setState({
                            isThisUser: true,
                        })
                        this.props.loginUser(this.state.userId, this.state.userName);
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
    handleFollowers = () => {
        this.setState({
            followersButton: true,
            followingButton: false,
            showPostButton: false,
        })
    }
    handleFollowing = () => {
        this.setState({
            followersButton: false,
            followingButton: true,
            showPostButton: false,
        })
    }
    handleShowPost = () => {
        this.setState({
            followersButton: false,
            followingButton: false,
            showPostButton: true,
        })
    }
    render() {
        const thisPageUserId = this.state.thisPageUserId;
        const editButton = this.state.isThisUser ? (
                <div>
                    <button onClick={this.handleEdit} className="waves-effect waves-light btn">Edit</button>
                </div>
        ) : (
                <div></div>
        );
        const followersList = this.state.followersButton ? (
            <div>
                <FollowerPage thisPageUserId={this.state.thisPageUserId}/>
            </div>
        ) : (
            <div></div>
        );
        const followingList = this.state.followingButton ? (
            <div>
                <FollowingPage thisPageUserId={this.state.thisPageUserId}/>
            </div>
        ) : (
            <div></div>
        );
        const postList = this.state.showPostButton ? (
            <div>
                <UserPost thisPageUserId={this.state.thisPageUserId}/>
            </div>
        ) : (
            <div></div>
        );
        return (
            <div className="container">
                <h1>Profile Page</h1>
                <div className="card">
                    <div className="row">
                        <div className="col s8">
                            <h4>{ this.state.thisPageUserName }</h4>
                            <h4>{ this.state.thisPageEmail }</h4>
                            
                            { editButton }
                        </div>
                        <div className="col s4">
                            <img href="" style={{width: 200 + 'px', height: 200 + 'px'}}></img>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="row">
                        <div className="col s4">
                            <button onClick={this.handleFollowers} className="waves-effect waves-light btn">{this.state.followersCount} Followers</button>
                        </div>
                        <div className="col s4">
                            <button onClick={this.handleFollowing} className="waves-effect waves-light btn">{this.state.followingCount} Following</button>
                        </div>
                        <div className="col s4">
                        <button onClick={this.handleShowPost} className="waves-effect waves-light btn">Post</button>
                        </div>
                    </div>
                </div>

                {followersList}
                {followingList}
                {postList}
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