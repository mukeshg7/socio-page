import React, { Component } from 'react'
import Axios from 'axios'
import Post from './Post'

class Feed extends Component {
    state = {
        posts: [],
        userName: this.props.userName,
        userId: this.props.userId,
        message: 'Loading...'
    }
    componentDidMount() {
        Axios.get('http://localhost:3000/feed', {withCredentials: true})
            .then(res => {
                if(res.status === 207) {
                    alert("You are not LoggedIn!")
                    this.props.history.push({
                        pathname: `/login`,
                    })
                } else {
                    this.setState({
                        posts: res.data,
                    })
                    if(this.state.posts.length === 0) {
                        this.setState({
                            message: 'No Posts to show!',
                        })
                    }
                }
            })
            .catch(err => console.log(err));
    }
    render() {
        const posts = this.state.posts;
        const postCards = posts.length ? (
            posts.map((post) => {
                return (
                        <Post post={post} key={post._id} userName={this.state.userName} userId={this.state.userId} />
                    )
                })
            ) : (
                <h4>{ this.state.message }</h4>
            );
    
        return(
            <div className="">
                {postCards}
            </div>
        )
    }
}

export default Feed;
