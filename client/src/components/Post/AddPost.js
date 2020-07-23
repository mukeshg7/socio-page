import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../../actions/action'


class AddPost extends Component {
    state = {
        userName: this.props.userName,
        body: "",
        likes: 0,
        isLoggedIn: false,
        userId: this.props.userId,
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
        Axios.post('http://localhost:5000/addpost', post, {withCredentials: true})
            .then(res => {
                if(res.status === 207) {
                    alert("You are not LoggedIn!")
                    this.props.logoutUser();
                    this.props.history.push({
                        pathname: `/login`,
                    })
                } else {
                    window.location.reload(true);
                }
            })
            .catch(err => console.log(err));
    }
    render() {
        
        return (
            <div className="container">
                <div>
                    <h5 className="center" style={{paddingTop: 20+'px'}}>Write something...</h5>
                    
                    <div className="row">
                        <div className="input-field col s12">
                            <label htmlFor="post">Post: </label>
                            <textarea onChange={this.handleBody} className="materialize-textarea" id="post" data-length="120" required />
                            <button onClick={this.handlePost} className="waves-effect waves-light btn">Post!</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logoutUser: () => dispatch(logout()),
    }
}

export default connect(null, mapDispatchToProps)(AddPost);