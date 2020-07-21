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
        isLiked: false,
        showPost: false,
        isUser: false,
    }
    componentDidMount() {
        const postId = this.props.post._id;
        Axios.get(`http://localhost:3000/postLike/${postId}`, {withCredentials: true})
            .then(res => {
                if(res.status === 201) {
                    console.log('Not follow');
                } else {
                    if(res.data.isLiked) {
                        this.setState({
                            isLiked: true,
                        });
                    }
                    if(res.data.isUser){
                        this.setState({
                            isUser: true,
                        })
                    }
                    this.setState({
                        showPost: true,
                    })
                }
            })
            .catch(err => console.log(err));
    }
    handleLike = (postId, userId) => {
        const data = {
            postId,
            userId: this.props.userId,
            isLiked: this.state.isLiked,
        }
        Axios.post('http://localhost:3000/like', data, {withCredentials: true})
            .then(res => {
                if(res.status === 200) {
                    this.setState({
                        likes: res.data.new,
                        isLiked: res.data.isLiked,
                    })
                } else {
                    alert("Post Not Available!")
                }
            })
            .catch(err => console.log(err));
    }
    handleDelete = (postId) => {
        Axios.get(`http://localhost:3000/delete/${postId}`, {withCredentials: true})
            .then(res => {
                if(res.status === 200) {
                    this.setState({
                        showPost: false,
                    })
                    alert('Post Deleted!');
                } else {
                    alert('Please Login to delete post!')
                    this.props.history.push({
                        pathname: `/login`
                    });
                }
            })
            .catch(err => console.log(err));
    }
    render() {
        const post = this.props.post;
        const likeButton = this.state.isLiked ? (
            <i className="fas fa-heart"></i>
        ) : (
            <i className="far fa-heart"></i>
        );
        const deleteButton = this.state.isUser ? (
            <button onClick={() => this.handleDelete(post._id)} className="right waves-effect waves-light btn-small">Delete</button>
        ) : (
            <div></div>
        );
        const postBody = this.state.showPost ? (
                    <div className="post card" key={post._id}>
                        <div className="card-content">
                            <span className="card-title"><Link to={{ pathname: `/profile/${post.userId}` }}>{post.userName}</Link></span>
                            <span className="right">{post.createdAt}</span>
                            <div><p>{post.body}</p></div>
                            <button onClick={() => this.handleLike(post._id, this.state.userID)} className="waves-effect waves-light btn-small">{this.state.likes}  {likeButton}</button>
                            {deleteButton}
                        </div>
                    </div>
        ) : (
            <div></div>
        );
        return (
            <div>
                { postBody }
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
