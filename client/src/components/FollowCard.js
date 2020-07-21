import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom'
import './FollowCard.css'
import img from '../assets/Pikachu.png'

class FollowCard extends Component {
    state = {
        buttonText: 'Follow',
        isDisable: false
    }

    handleFollowUnFollow = () => {
        this.setState({
            isDisable: true,
        })
        if(this.state.buttonText === 'Follow') {
            const data = {
                followUserId: this.props.user._id,
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
                unFollowUserId: this.props.user._id,
                unFollowUserName: this.props.user.userName,
            };
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
            <div className="post card followcard">
                <div className="card-content">
                    <div className="row">
                        <div className="col l4 m4 s12">
                            <img src={img}></img>
                        </div>
                        <div className="col l8 m8 s12">
                            <Link to={{ pathname: `/profile/${this.props.user.userId}` }}><span className="card-title">{user.userName}</span></Link>
                        </div>
                    </div>
                    <div class='btn-container'>
                        <button onClick={this.handleFollowUnFollow} disabled={this.state.isDisable} className="waves-effect waves-light btn-small">{this.state.buttonText}</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default FollowCard;