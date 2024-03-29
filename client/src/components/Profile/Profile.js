import React, { Component } from 'react'
import Axios from 'axios'
import {Link, withRouter} from 'react-router-dom'
import { connect } from 'react-redux'
import { login, logout } from '../../actions/action'
import UserPost from './UserPost'
import FollowerPage from './FollowerPage'
import FollowingPage from './FollowingPage'
import './Profile.css'
import img from '../../assets/Pikachu.png'

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
        isFollow: false,

        followersButton: false,
        followingButton: false,
        showPostButton: false,

        disableFollowBtn: false,
        disableFollowingBtn: false,

        gotData: false,

    }
    getData = () => {
        let path = this.props.history.location.pathname.slice(9);
        Axios.get(`http://localhost:5000/user/${path}`, {withCredentials: true})
            .then(res => {
                if(res.status === 207) {
                    this.props.logoutUser();
                    alert("You are not LoggedIn!")
                    this.props.history.push({
                        pathname: `/login`,
                    })
                } else if(res.status === 200) {
                    this.setState({
                        showPostButton: false,
                    });
                    this.setState({
                        userId: res.data.userId,
                        userName: res.data.userName,
                        thisPageUserId: this.props.history.location.pathname.slice(9),
                        thisPageUserName: res.data.thisPageUserName,
                        thisPageEmail: res.data.thisPageEmail,
                        followersCount: res.data.followersCount,
                        followingCount: res.data.followingCount,
                        followersButton: false,
                        followingButton: false,
                        showPostButton: true,
                        isFollow: res.data.isFollow,
                    })
                    if(this.state.userId === this.state.thisPageUserId) {
                        this.setState({
                            isThisUser: true,
                        })
                    } else {
                        this.setState({
                            isThisUser: false,
                        })
                    }
                    this.props.loginUser(this.state.userId, this.state.userName);
                } else {
                    this.props.history.push({
                        pathname: '/login'
                    })
                }
                console.log("aaa");
                this.setState({
                    gotData: true,
                })
            })
            .catch(err => console.log(err));
    }
    componentDidMount() {
        this.getData();
    }
    componentDidUpdate() {
        if(this.state.thisPageUserId) {
            if(this.state.thisPageUserId !== this.props.history.location.pathname.slice(9)) {
                this.getData();
            }
        }
    }
    
    handleEdit = () => {
        alert('This feature is not available at the moment.')
    }
    handleFollowers = () => {
        if(this.state.followersButton === true) {
            this.setState({
                followersButton: false,
            })
        } else {
            this.setState({
                followersButton: true,
                followingButton: false,
            })
        }
    }
    handleFollowing = () => {
        if(this.state.followingButton === true) {
            this.setState({
                followingButton: false,
            })
        } else {
            this.setState({
                followersButton: false,
                followingButton: true,
            })
        }
    }
    handleFollow = () => {
        this.setState({
            disableFollowBtn: true,
            disableFollowingBtn: true,
        })
        const data = {
            followUserId: this.state.thisPageUserId,
            followUserName: this.state.thisPageUserName,
        }
        Axios.post('http://localhost:5000/follow', data, {withCredentials: true})
            .then(res => {
                if(res.status === 200) {
                    this.setState({
                        isFollow: true,
                    });
                    window.location.reload(true);
                } else {
                    alert("You are not LoggedIn!")
                    this.props.history.push({
                        pathname: `/login`,
                    })
                }
            })
            .catch(err => console.log(err));
    }
    handleUnFollow = () => {
        this.setState({
            disableFollowingBtn: true,
            disableFollowBtn: true,
        })
        const data = {
            unFollowUserId: this.state.thisPageUserId,
            unFollowUserName: this.state.thisPageUserName,
        };
        Axios.post('http://localhost:5000/unfollow', data, {withCredentials: true})
            .then(res => {
                if(res.status === 200) {
                    this.setState({
                        isFollow: false,
                    });
                    window.location.reload(true);
                } else {
                    alert("You are not LoggedIn!")
                    this.props.history.push({
                        pathname: `/login`,
                    })
                }
            })
            .catch(err => console.log(err));
    }
    render() {
        
        const thisPageUserId = this.state.thisPageUserId;

        const followUnFollowBtn = this.state.isFollow ? (
            <button onClick={this.handleUnFollow} disabled={this.state.disableFollowBtn} className="waves-effect waves-light btn">Following</button>
        ) : (
            <button onClick={this.handleFollow} disabled={this.state.disableFollowingBtn} className="waves-effect waves-light btn">Follow</button>
        );
        const editButton = this.state.isThisUser ? (
                <div>
                    <button onClick={this.handleEdit} className="waves-effect waves-light btn">Edit</button>
                </div>
        ) : (
                <div>{followUnFollowBtn}</div>
        );
        const showBtns = this.state.gotData ? (
            <div>{editButton}</div>
        ) : (
            <div></div>
        );
        const followersList = this.state.followersButton ? (
            <div>
                <FollowerPage thisPageUserId={thisPageUserId}/>
            </div>
        ) : (
            <div></div>
        );
        const followingList = this.state.followingButton ? (
            <div>
                <FollowingPage thisPageUserId={thisPageUserId}/>
            </div>
        ) : (
            <div></div>
        );
        const postList = this.state.showPostButton ? (
            <div>
                <UserPost thisPageUserId={thisPageUserId}/>
            </div>
        ) : (
            <div></div>
        );
        
        return (
            <div className="container">
                <div className="profile">
                    <div className="row">
                        <div className="col l6 m12 s12">
                            <h3 className="center">Profile</h3>
                            <div className="card xxx">
                                <div className="row yyy">
                                    <div className="zzz">
                                        <div className="col l6 m12 s12">
                                            <div className="profileimage">
                                                <img src={img}></img>
                                            </div>
                                        </div>
                                        <div className="col l6 m12 s12">
                                            <div className="info">
                                                <h4>{ this.state.thisPageUserName }</h4>
                                                <p>{ this.state.thisPageEmail }</p>
                                                { showBtns }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card profile-btn-card">
                                <div className="profile-btn-container">
                                    <button onClick={this.handleFollowers} className="waves-effect waves-light btn">{this.state.followersCount} Followers</button>
                                    <button onClick={this.handleFollowing} className="waves-effect waves-light btn">{this.state.followingCount} Following</button>
                                </div>
                            </div>

                            {followersList}
                            {followingList}
                        </div>
                        <div className="col l6 m12 s12">
                            {postList}
                        </div>
                    </div>
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

export default connect(null, mapDispatchToProps)(Profile);