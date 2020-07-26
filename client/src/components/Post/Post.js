import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../../actions/action'
import img from '../../assets/Pikachu.png'
import './Post.css'

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
        Axios.get(`http://localhost:5000/postLike/${postId}`, {withCredentials: true})
            .then(res => {
                if(res.status === 201);
                else {
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
        Axios.post('http://localhost:5000/post/like', data, {withCredentials: true})
            .then(res => {
                if(res.status === 200) {
                    this.setState({
                        likes: res.data.new,
                        isLiked: res.data.isLiked,
                    })
                } else if(res.status === 203) {
                    alert("Post Not Available!")
                } else {
                    this.props.logoutUser();
                    alert("You are not LoggedIn!")
                    this.props.history.push({
                        pathname: `/login`,
                    })
                } 
            })
            .catch(err => console.log(err));
    }
    handleDelete = (postId) => {
        Axios.get(`http://localhost:5000/post/delete/${postId}`, {withCredentials: true})
            .then(res => {
                if(res.status === 207) {
                    this.props.logoutUser();
                    alert("You are not LoggedIn!")
                    this.props.history.push({
                        pathname: `/login`,
                    })
                } else if (res.status === 200) {
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
                    <div className="post card postcard" key={post._id}>

                        <div className="row post-top">
                            <div className="col s6">
                                <div className="post-info">
                                    <img src={img} />
                                    <Link to={{ pathname: `/profile/${post.userId}` }}><div><p>{post.userName}</p></div></Link>
                                </div>
                            </div>
                            <div className="col s6">
                                <br></br>
                                <div className="right" >{post.createdAt.slice(11, 16)}</div>
                                <br></br>
                                <div className="right" >{post.createdAt.slice(0, 10)}</div>
                            </div>
                        </div>
                        <div className="row post-body">
                            <p className="post-body-text">{post.body}</p>
                        </div>
                        <div className="row post-footer">
                            <div className="post-btn-container">
                                <button onClick={() => this.handleLike(post._id, this.state.userID)} className="waves-effect waves-light btn-small">{this.state.likes}  {likeButton}</button>
                                {deleteButton}
                            </div>
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
