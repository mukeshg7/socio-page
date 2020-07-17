import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom'

class FolloweringCard extends Component {
    state = {
        buttonText: 'Wait...',
        isDisable: true,
    }
    componentDidMount() {
        let path = this.props.user.userId;
        Axios.get(`http://localhost:3000/checkfollowstatus/${path}`, {withCredentials: true})
            .then(res => {
                if(path === this.props.userId) {
                    this.setState({
                        buttonText: 'Follow',
                        isDisable: true,
                    })
                } else if(res.data.isFollowing) {
                    this.setState({
                        buttonText: 'Following',
                        isDisable: false,
                    })
                } else {
                    this.setState({
                        buttonText: 'Follow',
                        isDisable: false,
                    })
                }
            })
            .catch(err => console.log(err));
    }
    handleFollowUnFollow = () => {
        this.setState({
            isDisable: true,
        })
        if(this.state.buttonText === 'Follow') {
            const data = {
                FollowUserId: this.props.user.userId,
                FollowUserName: this.props.user.userName,
            }
            Axios.post('http://localhost:3000/follow', data, {withCredentials: true})
                .then(res => {
                    if(res.status === 200) {
                        this.setState({
                            buttonText: 'Following',
                            isDisable: false,
                        })
                    }
                })
                .catch(err => console.log(err));
        } else {
            const data = {
                unFollowUserId: this.props.user.userId,
                unFollowUserName: this.props.user.userName,
            };console.log(data);
            Axios.post('http://localhost:3000/unfollow', data, {withCredentials: true})
                .then(res => {
                    if(res.status === 200) {
                        this.setState({
                            buttonText: 'Follow',
                            isDisable: false,
                        })
                    }
                })
                .catch(err => console.log(err));
        }
    }
    render() {
        const user = this.props.user;
        return (
            <div className="post card">
                <div className="card-content">
                    <li><Link to={{ pathname: `/profile/${this.props.user.userId}` }}><span className="card-title">{user.userName}</span></Link></li>
                    <button onClick={this.handleFollowUnFollow} disabled={this.state.isDisable} className="waves-effect waves-light btn-small">{this.state.buttonText}</button>
                </div>
            </div>
        )
    }
}

export default FolloweringCard;