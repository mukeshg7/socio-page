import React, { Component } from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'

class Login extends Component {
    state = {
        email: "",
        password: "",
    }
    componentDidMount() {
        const isLoggedIn = this.props.isLoggedIn;
        if(isLoggedIn) {
            const userId = this.props.userId;
            this.props.history.push({
                pathname: `/profile/${userId}`
            });
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        let userData = {
            email: this.state.email,
            password: this.state.password,
        }
        Axios.post(' http://localhost:3000/login', userData, {withCredentials: true})
            .then(response => {
                if(response.status === 203) {
                    alert("Some error occured. Please refresh the page.");
                    window.location.reload(true);
                } else if(response.status === 202) {
                    alert("Input Data Incorrect!");
                    window.location.reload(true); 
                } else if(response.status === 200) {
                    const userId = response.data.userId;
                    const userName = response.data.userName;
                    this.props.loginUser(userId, userName);
                    this.props.history.push({
                        pathname: `/profile/${userId}`
                    });
                }
            })
            .catch(err => console.log(err));
    }
    render() {
        return (
            <div className="container">
                <h1 className="center">Login</h1>
                <div className="col s4">
                    <form  onSubmit={this.handleSubmit}>
                    <div className="container">
                        <div className="input-field col s4">
                            <label htmlFor="email">Email: </label>
                            <input type="email" id="email" onChange={this.handleChange} required></input>
                        </div></div>
                        <div className="container">
                        <div className="input-field col s4">
                            <label htmlFor="password">Password: </label>
                            <input type="password" id="password" onChange={this.handleChange} required></input>
                        </div></div>
                        <div className="container center">
                        <button className="waves-effect waves-light btn">Login</button></div>
                    </form>
                </div>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);