import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'

class Post extends Component {
    state = {
        likes: this.props.post.likes,
        userName: this.props.userName,
        userId: this.props.userId,
    }
    
    handleLike = (postId, userId) => {
        const data = {
            postId,
            userId: this.props.userId,
        }
        Axios.post('http://localhost:3000/like', data, {withCredentials: true})
            .then(res => {
                if(res.status === 200) {
                    this.setState({
                        likes: res.data.new,
                    })
                } else {
                    alert("Post Not Available!")
                }
            })
            .catch(err => console.log(err));
    }
    render() {
        const post = this.props.post;
        return (
            <div className="row">
                <div className="col s8">
                    <div className="post card" key={post._id}>
                        <div className="card-content">
                            <span className="card-title">By | <li><Link to={{ pathname: `/profile/${post.userId}` }}>{post.userName}</Link></li></span>
                            <span className="right">{post.createdAt}</span>
                            <div><p>{post.body}</p></div>
                            <button onClick={() => this.handleLike(post._id, this.state.userID)} className="waves-effect waves-light btn-small"><i className="fas fa-fire-alt"></i></button>
                            <span>{this.state.likes}</span>
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

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userId: state.userId,
        userName: state.userName
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);
