import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import Post from '../Post/Post'

class UserPost extends Component {
    state = {
        userId: this.props.userId,
        userName: this.props.userName,
        thisPageUserId: this.props.thisPageUserId,
        posts: [],
        isLoggedIn: true,
        message: 'Loading...',
        showPost: true,
    }
    componentDidMount() {
        Axios.get(`http://localhost:5000/post/${this.state.thisPageUserId}`, {withCredentials: true})
            .then(res => {
                if(res.status === 207) {
                    this.props.logoutUser();
                    alert("You are not LoggedIn!")
                    this.props.history.push({
                        pathname: `/login`,
                    })
                } else if(res.status === 202) {
                    this.setState({
                        showPost: false,
                    })
                } else if (res.status === 200) {
                    this.setState({
                        posts: res.data,
                    })
                    if(this.state.posts.length === 0) {
                        this.setState({
                            message: 'No Posts',
                        });
                    }
                } else {
                    this.setState({
                        isLoggedIn: false,
                    })
                }
            })
    }
    render() {
        const posts = this.state.posts;
        const message = this.state.showPost ? (
            <h4 className="center">{this.state.message}</h4>
        ) : (
            <h4 className="center">Follow the person to view their Posts!</h4>
        );
        const body = posts.length ? (
            posts.map(post => {
                return (
                    <Post post={post} key={post._id} userName={this.state.userName} userId={this.state.userId} />
                )
            })
        ) : (
            <div>{message}</div>
        );
        const feed = this.state.isLoggedIn  ? (
            <div>
                <h3 className="center">Posts</h3>
                <div className="container">{body}</div>
            </div>
        ) : (
            <div><h4 className="center">Please Login!</h4></div>
        );
        return (
            <div>{feed}</div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.userId,
        userName: state.userName
    }
}

export default connect(mapStateToProps)(UserPost);