import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import Post from './Post'

class UserPost extends Component {
    state = {
        userId: this.props.userId,
        userName: this.props.userName,
        thisPageUserId: this.props.thisPageUserId,
        posts: [],
        isLoggedIn: true,
        message: 'Loading...',
    }
    componentDidMount() {
        Axios.get(`http://localhost:3000/post/${this.state.thisPageUserId}`, {withCredentials: true})
            .then(res => {
                if(res.status === 200) {
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
        const body = posts.length ? (
            posts.map(post => {
                return (
                    <Post post={post} userName={this.state.userName} userId={this.state.userId} />
                )
            })
        ) : (
            <h4>{this.state.message}</h4>
        );
        const feed = this.state.isLoggedIn  ? (
            <div>
                <h4 className="center">Your Posts!</h4>
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