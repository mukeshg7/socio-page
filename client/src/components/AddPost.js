import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'


class AddPost extends Component {
    state = {
        userName: "",
        body: "",
        likes: 0,
        isLoggedIn: false,
        userId: "",
    }
    componentDidMount() {
        Axios.get('http://localhost:3000/checkuser', {withCredentials: true})
            .then(res => {
                const isLoggedIn = res.data.isLoggedIn;
                this.setState({
                    isLoggedIn,
                    userName: res.data.userName,
                    userId: res.data.userId,
                })
                if(isLoggedIn) {
                    this.props.loginUser(res.data.userId, res.data.userName);
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
            userName: this.state.userName,
            userId: this.state.userId,
            likedUserIds: [],
        }
        Axios.post('http://localhost:3000/addpost', post, {withCredentials: true})
            .then(res => {
                if(res.status === 207) {

                } else {
                    this.props.history.push({
                        pathname: '/'
                    })
                }
            })
            .catch(err => console.log(err));
    }
    render() {
        const body = this.state.isLoggedIn ? (
            <div>
                <h1 className="center">{this.state.userName} you can add your post here!</h1>
                
                <div className="row">
                    <div className="input-field col s12">
                        <label htmlFor="post">Post: </label>
                        <textarea onChange={this.handleBody} className="materialize-textarea" id="post" data-length="120" required />
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

const mapDispatchToProps = (dispatch) => {
    return {
        loginUser:(userId, userName) => dispatch(login(userId, userName)),
        logoutUser: () => dispatch(logout()),
    }
}

export default connect(null, mapDispatchToProps)(AddPost);