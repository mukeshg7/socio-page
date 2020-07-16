import React, { Component } from 'react'
import Axios from 'axios';
import {Link} from 'react-router-dom'

class FollowCard extends Component {
    state = {
        buttonText: 'Follow',
        isDisable: false
    }
    handleFollow = () => {
        const data = {
            FollowUserId: this.props.user._id,
            FollowUserName: this.props.user.userName,
        }
        Axios.post('http://localhost:3000/follow', data, {withCredentials: true})
            .then(res => {
                if(res.status === 200) {
                    this.setState({
                        buttonText: 'Following',
                        isDisable: true,
                    })
                }
            })
            .catch(err => console.log(err));
    }
    render() {
        const user = this.props.user;
        return (
            <div className="post card">
                <div className="card-content">
                    <li><Link to={{ pathname: `/profile/${this.props.user._id}` }}><span className="card-title">{user.userName}</span></Link></li>
                    <button onClick={this.handleFollow} disabled={this.state.isDisable} className="waves-effect waves-light btn-small">{this.state.buttonText}</button>
                </div>
            </div>
        )
    }
}

export default FollowCard;