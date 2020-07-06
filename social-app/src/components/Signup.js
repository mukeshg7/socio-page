import React, {Component} from 'react'
import axios from 'axios'

class Signup extends Component {
    state = {
        email: "",
        userName: "",
        password: "",
        confirmPassword: "",
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
        }
        axios.post('http://localhost:3000/signup', userData)
            .then(res => {
                if(res.data === 'Successfull Signup!') {
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
                <form className="col s12" onSubmit={this.handleSubmit}>
                    <div className="input-field col s12">
                        <label htmlFor="email">Email: </label>
                        <input type="email" id="email" onChange={this.handleChange} className="validate" required />
                    </div>
                    <div className="input-field col s12">
                        <label htmlFor="userName">User Name: </label>
                        <input type="text" id="userName" onChange={this.handleChange} className="validate" required />
                    </div>
                    <div className="input-field col s12">
                        <input type="password" id="password" onChange={this.handleChange} className="validate" required />
                        <label htmlFor="password">Password: </label>
                    </div>
                    <div className="input-field col s12">
                        <label htmlFor="confirmPassword">Confirm Password: </label>
                        <input type="password" id="confirmPassword" onChange={this.handleChange} className="validate" required />
                    </div>
                    <button className="waves-effect waves-light btn">Signup</button>
                </form>
            </div>
        )
    }
}

export default Signup;