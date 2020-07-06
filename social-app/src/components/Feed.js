import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'

class Feed extends Component {
    state = {
        posts: [],
    }
    componentDidMount() {
        if(this.props.isLoggedIn) {
            Axios.get('http://localhost:3000/feed')
                .then(res => {
                    this.setState({
                        posts: res.data,
                    })
                })
                .catch(err => console.log(err));
        }
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
        const feed = this.props.isLoggedIn  ? (
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

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
    }
}

export default connect(mapStateToProps)(Feed);
