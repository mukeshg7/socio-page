import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'


class AddPost extends Component {
    state = {
        body: "",
        likes: 0,
    }
    handleBody = (e) => {
        this.setState({
            body: e.target.value,
        })
    }
    handlePost = (e) => {
        e.preventDefault();
        let post = {
            body: this.state.body,
            likes: this.state.likes,
            userName: this.props.userName,
        }
        Axios.post('http://localhost:3000/addpost', post, {withCredentials: true})
            .then(res => {
                console.log(res);
                this.props.history.push({
                    pathname: '/'
                })
            })
            .catch(err => console.log(err));
    }
    render() {
        const body = this.props.isLoggedIn ? (
            <div>
                <h1 className="center">{this.props.userName} you can add your post here!</h1>
                
                <div className="col s8">
                    <div className="input-field">
                        <label htmlFor="post">Post: </label>
                        <textarea onChange={this.handleBody} className="materialize-textarea" id="post" required></textarea>
                        <button onClick={this.handlePost} className="waves-effect waves-light btn">Post!</button>
                    </div>
                </div>
            </div>
        ) : (
            <div>
                <h4>Please Login/Signup to add a Post!</h4>
            </div>
        );
        return (
            <div className="container">
                { body }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        userId: state.userId,
        userName: state.userName,
    }
}

export default connect(mapStateToProps)(AddPost);