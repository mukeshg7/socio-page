import React, {Component} from 'react'
import Axios from 'axios'

class Signup extends Component {
    state = {
        email: "",
        userName: "",
        password: "",
        confirmPassword: "",
    }
    componentDidMount() {
        Axios.get('http://localhost:3000/checkuser', {withCredentials: true})
            .then(res => {
                if(res.data.isLoggedIn) {
                    this.props.loginUser(res.data.userId, res.data.userName);
                    this.props.history.push({
                        pathname: `/profile/${res.data.userId}`,
                    })
                }
            })
            .catch(err => console.log(err));
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
            userName: this.state.userName,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            followers: [],
            following: [],
            followersCount: 0,
            followingCount: 0,
        }
        Axios.post('http://localhost:3000/signup', userData, {withCredentials: true})
            .then(res => {
                if(res.status === 201) {
                    alert("User Already LoggedIn. Redirecting to Profile.")
                    this.props.history.push({
                        pathname: `/profile/${res.data.userId}`,
                    })
                } else if(res.data === 'Successfull Signup!') {
                    this.props.history.push('/');
                } else {
                    alert(res.data);
                }
            })
            .catch(err => console.log(err));
            
    }
    render() {
        return(
            <div className="container">
                <h1 className="center">Signup</h1>
                <form className="col s4 center" onSubmit={this.handleSubmit}>
                    <div className="container">
                        <div className="input-field col s4">
                        <label htmlFor="email">Email: </label>
                        <input type="email" id="email" onChange={this.handleChange} className="validate" required />
                        </div>
                    </div>
                    <div className="container">
                    <div className="input-field col s4">
                        <label htmlFor="userName">User Name: </label>
                        <input type="text" id="userName" onChange={this.handleChange} className="validate" required />
                    </div></div>
                    <div className="container">
                    <div className="input-field col s4">
                        <input type="password" id="password" onChange={this.handleChange} className="validate" required />
                        <label htmlFor="password">Password: </label>
                    </div></div>
                    <div className="container">
                    <div className="input-field col s4">
                        <label htmlFor="confirmPassword">Confirm Password: </label>
                        <input type="password" id="confirmPassword" onChange={this.handleChange} className="validate" required />
                    </div></div>
                    <div className="container center">
                    <button className="waves-effect waves-light btn">Signup</button></div>
                </form>
            </div>
        )
    }
}

export default Signup;