import React, { Component } from 'react'
import Feed from './Feed'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'
import img from '../assets/Pikachu.png'

class Home extends Component {
    state = {
        userId: this.props.userId,
        userName: this.props.userName,
        isLoggedIn: true,
    }
    componentDidMount() {
        Axios.get('http://localhost:3000/checkuser', {withCredentials: true})
            .then(res => {
                const isLoggedIn = res.data.isLoggedIn;
                this.setState({
                    isLoggedIn,
                    userId: res.data.userId,
                    userName: res.data.userName,
                })
                if(isLoggedIn) {
                    this.props.loginUser(res.data.userId, res.data.userName);
                } else {
                    this.props.logoutUser();
                }
            })
            .catch(err => console.log(err));
    }
    render () {
        const body = this.state.isLoggedIn ? (
            <div>
                <h1 className="center">Welcome to SocioPage!</h1>
                <div className="row container">
                    
                    <div className="col l4 s12">
                        <div className="card">
                            <div className="row">
                                <div className="col l6">
                                    <h4>{this.state.userName}</h4>
                                </div>
                                <div className="col l6">
                                    <img src={img} style={{width: 100+'%', height: 100+'%', }}></img>
                                </div>
                            </div>
                        </div>
                    </div>
    
    
                    <div className="col l8 s12">
                        <Feed userId={this.state.userId} userName={this.state.userName} />
                    </div>
    
    
                </div>
            </div>
        ) : (
            <h2>Please Login/Signup to view the posts!</h2>
        );
        return(
            <div>
                {body}
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);