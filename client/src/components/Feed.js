import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'

class Feed extends Component {
    state = {
        posts: [],
        isLoggedIn: false,
    }
    componentDidMount() {
        Axios.get('http://localhost:3000/checkuser', {withCredentials: true})
            .then(res => {
                const isLoggedIn = res.data.isLoggedIn;
                console.log(isLoggedIn);
                this.setState({
                    isLoggedIn
                })
                if(isLoggedIn) {
                    this.props.loginUser(res.data.userId);
                    Axios.get('http://localhost:3000/feed')
                        .then(res => {
                            this.setState({
                                posts: res.data,
                            })
                        })
                        .catch(err => console.log(err));
                } else {
                    this.props.logoutUser();
                }
            })
            .catch(err => console.log(err));
    }
    handleLike = () => {

    }
    render() {
        const posts = this.state.posts;
        const postCard = posts.length ? (
            posts.map(post => {
                return (
                        <div className="post card" key={post._id}>
                            <div className="card-content">
                                <span className="card-title">By | {post.userName}</span>
                                <span className="right">{post.createdAt}</span>
                                <p>{post.body}</p>
                                <button onClick={this.handleLike} className="waves-effect waves-light btn-small"><i className="fas fa-fire-alt"></i></button>
                            </div>
                        </div>
                    )
                })
            ) : (
                <h4>Post not available.</h4>
            );
        const feed = this.state.isLoggedIn  ? (
            <div>
                <h1 className="center">Feed</h1>
                <div className="container">{postCard}</div>
            </div>
        ) : (
            <div><h4 className="center">Please Login/Signup to view the posts!</h4></div>
        );
        return(
            <div>
                {feed}
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

export default connect(null, mapDispatchToProps)(Feed);
