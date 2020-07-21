import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom'
import img from '../assets/Pikachu.png'
import './FolloweringCard.css'

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
                followUserId: this.props.user.userId,
                followUserName: this.props.user.userName,
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
            <div className="post card followeringCard">
                <div className="card-content">
                    <div className="row">
                        <div className="col l4 m4 s12">
                            <div className="image">
                                <img src={img}></img>
                            </div>
                        </div>
                        <div className="col l8 m8 s12">
                            <Link to={{ pathname: `/profile/${this.props.user.userId}` }}><span className="card-title">{user.userName}</span></Link>
                        </div>
                    </div>
                    <div className="btn-container">
                        <button onClick={this.handleFollowUnFollow} disabled={this.state.isDisable} className="waves-effect waves-light btn-small">{this.state.buttonText}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default FolloweringCard;