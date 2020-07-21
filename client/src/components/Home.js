import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login, logout } from '../actions/action'
import Feed from './Post/Feed'
import './Home.css'
import img from '../assets/Pikachu.png'

class Home extends Component {
    state = {
        userId: this.props.userId,
        userEmail: '',
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
                    userEmail: res.data.userEmail,
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
            <div className="home">
                <h1 className="center">Welcome to SocioPage!</h1>
                <div className="row">
                
                    <div className="col l3 m7 s12">
                        <div className="card profilecard">
                            <div className="row">
                                <div className="col l6 m6 s6">
                                    <img src={img} style={{width: 100+'%', height: 100+'%', }}></img>
                                </div>
                                <div className="col l6 m6 s6">
                                    <h4><Link to={{ pathname: `/profile/${this.state.userId}` }}>{this.state.userName}</Link></h4>
                                    <p>{this.state.userEmail}</p>
                                    <Link to='/addpost'><button class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">add</i></button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div className="col l6 m12 s12">
                        <Feed userId={this.state.userId} userName={this.state.userName} />
                    </div>

                    <div className="col l3 m5 s12">
                        <h4>Search</h4>
                        <div className="card">
                            <p>aaa</p>
                        </div>
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