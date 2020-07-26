import React, { Component } from 'react'
import ReactSearchBox from 'react-search-box'
import {Link, withRouter} from 'react-router-dom'
import Axios from 'axios';

class Search extends Component {
    state = {
        users: [],
    }

    componentDidMount() {
        Axios.get('http://localhost:5000/users', {withCredentials: true})
            .then(res => {
                if(res.status === 207) {
                    alert("You are not LoggedIn!")
                    this.props.history.push({
                        pathname: `/login`,
                    })
                } else if(res.status === 200) {
                    this.setState({
                        users: res.data,
                    })
                } else {
                    alert("Some error occured! Please refresh the page!");
                }
            })
    }
    redirectFunction = (selectedUser) => {
        this.props.history.push({
            pathname: `/profile/${selectedUser.key}`
        })
    }
    render() {
        const users = [];
        this.state.users.forEach(user => {
            users.push({
                key: user._id,
                value: user.userName,
            });
        });
        return (
            <div>
                <label htmlFor="search"><strong>Search UserName:</strong> </label>
                <ReactSearchBox className="input-field" id="search"
                    placeholder=""
                    data={users}
                    onSelect = {selectedUser => {
                        this.redirectFunction(selectedUser);
                    }}
                    // onFocus={() => {
                    // console.log('This function is called when is focussed')}}
                    // onChange={value => console.log(value)}
                    fuseConfigs={{
                    threshold: 0.05,
                    }}
                    value=""
                />
            </div>
        )
    }
}
export default withRouter(Search);