import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'
import Post from './Post'

class Feed extends Component {
    state = {
        posts: [],
        isLoggedIn: true,
        userName: this.props.userName,
        userId: this.props.userId,
        message: 'Loading...'
    }
    componentDidMount() {
        Axios.get('http://localhost:3000/checkuser', {withCredentials: true})
            .then(res => {
                const isLoggedIn = res.data.isLoggedIn;
                this.setState({
                    isLoggedIn,
                    userName: this.props.userName,
                    userId: this.props.userId,
                })
                if(isLoggedIn) {
                    this.props.loginUser(res.data.userId);
                    Axios.get('http://localhost:3000/feed')
                        .then(res => {
                            this.setState({
                                posts: res.data,
                            })
                            if(this.state.posts.length === 0) {
                                this.setState({
                                    message: 'No Posts to show!',
                                })
                            }
                        })
                        .catch(err => console.log(err));
                } else {
                    this.props.logoutUser();
                }
            })
            .catch(err => console.log(err));
    }
    render() {
        const posts = this.state.posts;
        const postCards = posts.length ? (
            posts.map((post) => {
                return (
                        <Post post={post} userName={this.state.userName} userId={this.state.userId} />
                    )
                })
            ) : (
                <h4>{ this.state.message }</h4>
            );
        const feed = this.state.isLoggedIn  ? (
            <div>
                <h1 className="center">Feed</h1>
                <div className="container">{postCards}</div>
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

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userId: state.userId,
        userName: state.userName
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
